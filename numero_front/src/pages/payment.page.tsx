import { FC, useState, useCallback, memo } from "react";
import { Page } from "@/components/Page";
import { CurrencyChip } from "@/components/CurrencyChip";
import { api, API_ENDPOINTS } from "@/config/api";
import WebApp from "@twa-dev/sdk";

// — типы и данные
type PackCode = "SMALL" | "LARGE";

interface CreateInvoiceResponse {
success: boolean;
invoiceLink?: string;
error?: string;
}

const PACK_PRICES: Record<PackCode, number> = {
SMALL: 1,
LARGE: 2,
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
    code: "SMALL",
    title: "Малый пакет",
    predictions: "10 предсказаний",
    diamonds: "1000",
    priceText: "Стоимость: ⭐ 100 Stars (~150₽)",
    ctaText: "Купить за 100 Stars",
},
{
    code: "LARGE",
    title: "Большой пакет",
    predictions: "50 предсказаний",
    diamonds: "5000",
    priceText: "Стоимость: ⭐ 500 Stars (~750₽)",
    ctaText: "Купить за 500 Stars",
},
];

// — создание инвойса
async function createInvoice(pack: PackCode) {
const userId = WebApp.initDataUnsafe?.user?.id;
if (!userId) throw new Error("User not found");

const response = await api.post<CreateInvoiceResponse>(API_ENDPOINTS.payment.createInvoice, {
    payload: `${pack}_Pack_User_${userId}_${Date.now()}`,
    currency: "XTR",
    prices: [{ amount: PACK_PRICES[pack] }],
});

if (!response.data.success || !response.data.invoiceLink) {
    throw new Error(response.data.error || "Failed to create invoice");
}

return new Promise<void>((resolve, reject) => {
    let resolved = false;
    const timeout = setTimeout(() => {
    if (!resolved) {
        resolved = true;
        resolve();
    }
    }, 60000);

    WebApp.openInvoice(response.data.invoiceLink!, (status) => {
    if (resolved) return;
    resolved = true;
    clearTimeout(timeout);

    if (status === "paid") {
        WebApp.showPopup({
        title: "Успешно!",
        message: "Алмазики успешно добавлены на ваш баланс",
        buttons: [{ type: "ok" }],
        });
        resolve();
    } else if (status === "failed") {
        reject(new Error("Payment failed"));
    } else {
        resolve();
    }
    });
});
}

// — переиспользуемая карточка пакета
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
    <div className="rounded-2xl bg-gradient-to-r from-fuchsia-600/10 via-violet-600/10 to-indigo-600/10 border border-violet-400/30 shadow-lg p-5 text-center backdrop-blur-sm">
    <h2 className="text-lg font-semibold text-violet-100 mb-2">{title}</h2>
    <p className="text-sm text-violet-200 mb-4">{predictions}</p>
    <CurrencyChip value={diamonds} className="bg-violet-500/20 border-violet-400/40 mb-4" />
    <p className="text-sm text-violet-300 mb-5">{priceText}</p>
    <button
        type="button"
        onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onBuy(code);
        }}
        disabled={disableAll}
        aria-busy={isActive}
        className={`w-full rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 py-3 text-white font-medium hover:brightness-110 active:brightness-95 transition
        ${isActive ? "opacity-60 cursor-not-allowed" : ""}`}
    >
        {isActive ? "Создаём счёт…" : ctaText}
    </button>
    </div>
);
});

// — страница
export const PaymentPage: FC = () => {
const [loading, setLoading] = useState<PackCode | null>(null);
const disableAll = loading !== null;

const handleBuy = useCallback(
    async (pack: PackCode) => {
    if (loading !== null) return;
    try {
        setLoading(pack);
        await createInvoice(pack);
    } catch (error) {
        const message = (error as Error).message;
        if (!message.includes("cancelled") && !message.includes("Payment failed")) {
        WebApp.showPopup({
            title: "Ошибка",
            message: `Не удалось создать счёт: ${message}`,
            buttons: [{ type: "close" }],
        });
        }
    } finally {
        setLoading(null);
    }
    },
    [loading]
);

return (
    <Page>
    <main className="page payment-page fixed inset-0 flex flex-col items-center justify-start py-10 px-6 text-white">
        {/* баланс */}
        <section className="w-full max-w-md text-center mb-8">
        <p className="text-sm text-violet-200 mb-2">Ваш баланс</p>
        <CurrencyChip value="120" className="text-lg bg-violet-500/20 border-violet-400/40" />
        </section>

        {/* описание */}
        <section className="w-full max-w-md text-center mb-10">
        <h1 className="text-2xl font-semibold mb-3 text-violet-100">Пополните баланс алмазиков</h1>
        <p className="text-violet-200 text-sm leading-relaxed">
            Алмазики используются для покупки дополнительных предсказаний.
            <br />
            Вы можете приобрести их с помощью <span className="font-medium text-violet-100">Telegram Stars</span>.
        </p>
        </section>

        {/* пакеты */}
        <section className="w-full max-w-md flex flex-col gap-6">
        {PACK_META.map((p) => (
            <PurchaseCard
            key={p.code}
            code={p.code}
            title={p.title}
            predictions={p.predictions}
            diamonds={p.diamonds}
            priceText={p.priceText}
            ctaText={p.ctaText}
            loading={loading}
            onBuy={handleBuy}
            disableAll={disableAll}
            />
        ))}
        </section>
    </main>
    </Page>
);
};
