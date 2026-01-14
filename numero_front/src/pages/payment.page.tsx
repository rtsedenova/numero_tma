import { useCallback, useState } from 'react';
import WebApp from '@twa-dev/sdk';

import { Page } from '@/components/Page';
import { CurrencyChip } from '@/components/CurrencyChip';
import { PurchaseCard } from '@/components/payment/PurchaseCard';
import { api, API_ENDPOINTS } from '@/config/api';
import { usePredictionAttempts } from '@/storage/predictionAttempts';

type PackCode = 'SMALL' | 'LARGE';

interface CreateInvoiceResponse {
success: boolean;
invoiceLink?: string;
error?: string;
}

interface PaymentStatusResponse {
success: boolean;
successful_payment: boolean;
error?: string;
}

const PACK_PRICES: Record<PackCode, number> = {
SMALL: 1,
LARGE: 1,
};

const PACK_META: Array<{
code: PackCode;
title: string;
predictions: string;
diamonds: string;
priceText: string;
ctaText: string;
}> = [
{
    code: 'SMALL',
    title: 'Малый пакет',
    predictions: '10 предсказаний',
    diamonds: '1000',
    priceText: 'Стоимость: ⭐ 100 Stars (~150₽)',
    ctaText: 'Купить',
},
{
    code: 'LARGE',
    title: 'Большой пакет',
    predictions: '50 предсказаний',
    diamonds: '5000',
    priceText: 'Стоимость: ⭐ 500 Stars (~750₽)',
    ctaText: 'Купить',
},
];

const DEBUG_PAYMENT = false;
const log = (...args: unknown[]) => {
if (DEBUG_PAYMENT) console.log('[PAYMENT]', ...args);
};

const showPopupSafe = (params: { title: string; message: string }) => {
try {
    WebApp.showPopup({
    title: params.title,
    message: params.message,
    buttons: [{ type: 'close' }],
    });
} catch (error) {
    console.error('[PAYMENT] showPopup failed:', error);
    console.error('[PAYMENT] popup params:', params);
}
};

const getUserId = (): number => {
const userId = WebApp.initDataUnsafe?.user?.id;
if (!userId) throw new Error('User not found');
return userId;
};

const makePayload = (pack: PackCode, userId: number): string =>
`${pack}_Pack_User_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const sleep = (ms: number, timeouts: number[]): Promise<void> =>
new Promise((resolve) => {
    const t = window.setTimeout(resolve, ms);
    timeouts.push(t);
});

async function checkPaymentStatus(payload: string): Promise<boolean> {
try {
    const response = await api.post<PaymentStatusResponse>(
    API_ENDPOINTS.payment.checkStatus,
    { payload },
    );

    return response.data.success && response.data.successful_payment;
} catch (error) {
    console.error('[PAYMENT] Error checking payment status:', error);
    return false;
}
}

async function createInvoiceLink(pack: PackCode): Promise<{ payload: string; invoiceLink: string }> {
const userId = getUserId();
const payload = makePayload(pack, userId);

const response = await api.post<CreateInvoiceResponse>(
    API_ENDPOINTS.payment.createInvoice,
    {
    payload,
    currency: 'XTR',
    prices: [{ amount: PACK_PRICES[pack] }],
    },
);

if (!response.data.success || !response.data.invoiceLink) {
    throw new Error(response.data.error || 'Failed to create invoice');
}

return { payload, invoiceLink: response.data.invoiceLink };
}

async function runInvoiceFlow(pack: PackCode): Promise<void> {
const { payload, invoiceLink } = await createInvoiceLink(pack);

return new Promise<void>((resolve, reject) => {
    let finished = false;
    let invoiceClosed = false;
    let paymentConfirmed = false;
    let pollingStopped = false;
    let errorPopupShown = false;

    const activeTimeouts: number[] = [];

    const clearAllTimeouts = () => {
    activeTimeouts.forEach((t) => clearTimeout(t));
    activeTimeouts.length = 0;
    };

    const showSuccess = () => {
    const userId = WebApp.initDataUnsafe?.user?.id;
    if (userId) {
        usePredictionAttempts.getState().fetchPredictions(userId);
    }
    };

    const showErrorOnce = (message: string) => {
    if (errorPopupShown) {
        log('Error popup already shown, skipping');
        return;
    }
    errorPopupShown = true;
    showPopupSafe({ title: 'Ошибка', message });
    };

    const finish = (opts: { ok?: boolean; errorMessage?: string } = {}) => {
    if (finished) {
        log('finish() already called, ignoring');
        return;
    }

    finished = true;
    pollingStopped = true;
    clearAllTimeouts();

    if (opts.ok && paymentConfirmed) {
        showSuccess();
    } else if (opts.errorMessage) {
        showErrorOnce(opts.errorMessage);
    }

    resolve();
    };

    const startPolling = async () => {
    const maxAttempts = 75;
    const pollIntervalMs = 1000;

    for (let attempt = 0; attempt < maxAttempts && !finished && !pollingStopped; attempt++) {
        try {
        const isSuccessful = await checkPaymentStatus(payload);

        if (isSuccessful) {
            log('Payment confirmed by backend');
            paymentConfirmed = true;
            finish({ ok: true });
            return;
        }
        } catch (pollError) {
        console.error('[PAYMENT] Error during payment status check:', pollError);
        }

        if (!finished && !pollingStopped) {
        await sleep(pollIntervalMs, activeTimeouts);
        }
    }

    if (!finished && !pollingStopped) {
        log('Polling completed without confirmation');
        pollingStopped = true;

        if (invoiceClosed) {
        finish({
            ok: false,
            errorMessage:
            'Платеж не подтвержден. Если платеж был выполнен, алмазики будут добавлены в течение нескольких минут.',
        });
        } else {
        finish();
        }
    }
    };

    const safetyTimeout = window.setTimeout(() => {
    if (finished) return;
    log('Safety timeout reached (90s)');

    if (paymentConfirmed) {
        finish({ ok: true });
    } else {
        finish({
        ok: false,
        errorMessage:
            'Время ожидания истекло. Пожалуйста, проверьте статус платежа в истории транзакций.',
        });
    }
    }, 90_000);
    activeTimeouts.push(safetyTimeout);

    log('Opening invoice', { payload });
    startPolling();

    WebApp.openInvoice(invoiceLink, (status) => {
    log('Invoice callback', { status });
    invoiceClosed = true;

    if (finished) {
        log('Already finished, ignoring invoice callback');
        return;
    }

    if (status === 'failed') {
        finish({ ok: false, errorMessage: 'Платеж не прошел. Пожалуйста, попробуйте еще раз.' });
        reject(new Error('Payment failed'));
        return;
    }

    if (status === 'cancelled') {
        finish();
        return;
    }

    if (status === 'paid' && !paymentConfirmed && pollingStopped) {
        checkPaymentStatus(payload)
        .then((isSuccessful) => {
            if (finished) return;

            if (isSuccessful) {
            paymentConfirmed = true;
            finish({ ok: true });
            return;
            }

            const finalCheckTimeout = window.setTimeout(() => {
            if (finished) return;
            log('Final check timeout - invoice said paid but backend not confirmed');
            finish({
                ok: false,
                errorMessage:
                'Платеж обрабатывается. Алмазики будут добавлены в течение нескольких минут.',
            });
            }, 5000);

            activeTimeouts.push(finalCheckTimeout);
        })
        .catch(() => {
        });
    }
    });
});
}

export function PaymentPage() {
const [loading, setLoading] = useState<PackCode | null>(null);
const disableAll = loading !== null;

const { credits, isLoading: isPredictionsLoading } = usePredictionAttempts();

const handleBuy = useCallback(
    async (pack: PackCode) => {
    if (loading !== null) {
        log('Payment already in progress, ignoring request');
        return;
    }

    try {
        setLoading(pack);
        await runInvoiceFlow(pack);
    } catch (error) {
        console.error('[PAYMENT] Purchase error:', error);
        const message = (error as Error).message;

        if (!message.includes('cancelled') && !message.includes('Payment failed')) {
        showPopupSafe({
            title: 'Ошибка',
            message: `Не удалось создать счёт: ${message}`,
        });
        }
    } finally {
        setLoading(null);
    }
    },
    [loading],
);

return (
    <Page>
    <main className="payment-page page fixed inset-0 flex flex-col items-center justify-start px-6 py-10 bg-[var(--bg)]">

        <section className="mb-8 w-full max-w-md text-center">
        <p className="mb-2 text-base md:text-lg font-medium text-[var(--text-secondary)]">Ваш баланс</p>
        <CurrencyChip
            value={credits !== null ? String(credits) : '0'}
            isLoading={isPredictionsLoading || credits === null}
            className="border-[var(--border)] bg-[var(--el-bg)]"
        />
        </section>

        <section className="mb-10 w-full max-w-md text-center">
        <h1 className="mb-3 md:mb-6 text-2xl md:text-3xl font-semibold text-[var(--text)]">Пополните баланс алмазиков</h1>
        <p className="text-base md:text-lg leading-relaxed md:leading-normal text-[var(--text-secondary)]">
            Алмазики используются для покупки дополнительных предсказаний.
            <br />
            Вы можете приобрести их с помощью{' '}
            <span className="font-medium text-[var(--text)]">Telegram Stars</span>.
        </p>
        </section>

        <section className="flex w-full max-w-md md:max-w-4xl flex-col md:flex-row gap-6 mb-14">
        {PACK_META.map((pack) => (
            <div key={pack.code} className="w-full md:w-1/2">
                <PurchaseCard
                code={pack.code}
                title={pack.title}
                predictions={pack.predictions}
                diamonds={pack.diamonds}
                priceText={pack.priceText}
                ctaText={pack.ctaText}
                loading={loading}
                onBuy={handleBuy}
                disableAll={disableAll}
                />
            </div>
        ))}
        </section>
    </main>
    </Page>
);
}
