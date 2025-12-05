import { memo, useCallback, useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

import { Page } from '@/components/Page';
import { CurrencyChip } from '@/components/CurrencyChip';
import { api, API_ENDPOINTS } from '@/config/api';
import { usePredictionAttempts } from '@/storage/predictionAttempts';
import { useTelegramUser } from '@/hooks/useTelegramUser';

type PackCode = 'SMALL' | 'LARGE';

interface CreateInvoiceResponse {
success: boolean;
invoiceLink?: string;
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
    ctaText: 'Купить за 100 Stars',
},
{
    code: 'LARGE',
    title: 'Большой пакет',
    predictions: '50 предсказаний',
    diamonds: '5000',
    priceText: 'Стоимость: ⭐ 500 Stars (~750₽)',
    ctaText: 'Купить за 500 Stars',
},
];

async function createInvoice(pack: PackCode): Promise<void> {
const userId = WebApp.initDataUnsafe?.user?.id;

if (!userId) {
    throw new Error('User not found');
}

const response = await api.post<CreateInvoiceResponse>(
    API_ENDPOINTS.payment.createInvoice,
    {
    payload: `${pack}_Pack_User_${userId}_${Date.now()}`,
    currency: 'XTR',
    prices: [{ amount: PACK_PRICES[pack] }],
    },
);

if (!response.data.success || !response.data.invoiceLink) {
    throw new Error(response.data.error || 'Failed to create invoice');
}

const invoiceLink = response.data.invoiceLink;

return new Promise<void>((resolve, reject) => {
    let resolved = false;

    const timeout = setTimeout(() => {
    if (resolved) return;
    resolved = true;
    resolve();
    }, 60000);

    WebApp.openInvoice(invoiceLink, (status) => {
    if (resolved) return;

    resolved = true;
    clearTimeout(timeout);

    if (status === 'paid') {
        WebApp.showPopup({
        title: 'Успешно!',
        message: 'Алмазики успешно добавлены на ваш баланс',
        buttons: [{ type: 'ok' }],
        });

        const updatedUserId = WebApp.initDataUnsafe?.user?.id;

        if (updatedUserId) {
        usePredictionAttempts.getState().fetchPredictions(updatedUserId);
        }

        resolve();
    } else if (status === 'failed') {
        reject(new Error('Payment failed'));
    } else {
        resolve();
    }
    });
});
}

const PurchaseCard = memo(function PurchaseCard({
code,
title,
predictions,
diamonds,
priceText,
ctaText,
loading,
onBuy,
disableAll,
}: {
code: PackCode;
title: string;
predictions: string;
diamonds: string;
priceText: string;
ctaText: string;
loading: PackCode | null;
onBuy: (code: PackCode) => void;
disableAll: boolean;
}) {
const isActive = loading === code;

return (
    <div className="rounded-2xl border border-violet-400/30 bg-gradient-to-r from-fuchsia-600/10 via-violet-600/10 to-indigo-600/10 p-5 text-center shadow-lg backdrop-blur-sm">
    <h2 className="mb-2 text-lg font-semibold text-violet-100">{title}</h2>
    <p className="mb-4 text-sm text-violet-200">{predictions}</p>
    <CurrencyChip
        value={diamonds}
        className="mb-4 border-violet-400/40 bg-violet-500/20"
    />
    <p className="mb-5 text-sm text-violet-300">{priceText}</p>
    <button
        type="button"
        onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onBuy(code);
        }}
        disabled={disableAll}
        aria-busy={isActive}
        className={`w-full rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 py-3 font-medium text-white transition hover:brightness-110 active:brightness-95 ${
        isActive ? 'cursor-not-allowed opacity-60' : ''
        }`}
    >
        {isActive ? 'Создаём счёт…' : ctaText}
    </button>
    </div>
);
});

export function PaymentPage() {
const [loading, setLoading] = useState<PackCode | null>(null);
const disableAll = loading !== null;

const { user } = useTelegramUser();
const {
    credits,
    fetchPredictions,
    isLoading: isPredictionsLoading,
} = usePredictionAttempts();

useEffect(() => {
    if (!user?.id) return;
    fetchPredictions(user.id);
}, [user?.id, fetchPredictions]);

const handleBuy = useCallback(
    async (pack: PackCode) => {
    if (loading !== null) return;

    try {
        setLoading(pack);
        await createInvoice(pack);
    } catch (error) {
        const message = (error as Error).message;

        if (
        !message.includes('cancelled') &&
        !message.includes('Payment failed')
        ) {
        WebApp.showPopup({
            title: 'Ошибка',
            message: `Не удалось создать счёт: ${message}`,
            buttons: [{ type: 'close' }],
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
    <main className="payment-page page fixed inset-0 flex flex-col items-center justify-start px-6 py-10 text-white">
        <section className="mb-8 w-full max-w-md text-center">
        <p className="mb-2 text-sm text-violet-200">Ваш баланс</p>
        <CurrencyChip
            value={
            isPredictionsLoading || credits === null ? '...' : String(credits)
            }
            className="border-violet-400/40 bg-violet-500/20 text-lg"
        />
        </section>

        <section className="mb-10 w-full max-w-md text-center">
        <h1 className="mb-3 text-2xl font-semibold text-violet-100">
            Пополните баланс алмазиков
        </h1>
        <p className="text-sm leading-relaxed text-violet-200">
            Алмазики используются для покупки дополнительных предсказаний.
            <br />
            Вы можете приобрести их с помощью{' '}
            <span className="font-medium text-violet-100">
            Telegram Stars
            </span>
            .
        </p>
        </section>

        <section className="flex w-full max-w-md flex-col gap-6">
        {PACK_META.map((pack) => (
            <PurchaseCard
            key={pack.code}
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
        ))}
        </section>
    </main>
    </Page>
);
}
