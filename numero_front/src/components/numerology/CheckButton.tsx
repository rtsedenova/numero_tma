import type { ReactNode } from "react";
import { useDateStore } from "../../storage/dateStore";
import { WarningCircle } from "phosphor-react";

export interface CheckButtonProps {
label?: string;
loading?: boolean;
disabled?: boolean;
onClick?: () => void;
onDateCheck?: (selectedDate: string | null) => void;
className?: string;
showValidationError?: boolean;
leftIcon?: ReactNode;
rightIcon?: ReactNode;
}

export const CheckButton = ({
label = "Проверить",
loading = false,
disabled = false,
onClick,
onDateCheck,
className = "",
showValidationError = false,
leftIcon,
rightIcon,
}: CheckButtonProps) => {
const { selectedDate, hasCompleteDate } = useDateStore();
const isDisabled = disabled || loading;
const hasValidDate = hasCompleteDate();
const showError = showValidationError && !hasValidDate;

const handleClick = () => {
    if (onDateCheck) {
    onDateCheck(selectedDate);
    }
    onClick?.();
};

return (
    <div className="flex flex-col gap-2">
    <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={`
        inline-flex justify-center min-w-xs items-center gap-2 px-4 py-2 rounded-full
        border border-violet-300/70
        shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]
        bg-gradient-to-r from-fuchsia-500/10 via-violet-500/10 to-indigo-500/10
        text-violet-100 font-semibold
        transition-all
        hover:from-fuchsia-500/30 hover:via-violet-500/20 hover:to-indigo-500/20
        hover:text-violet-50
        active:scale-[0.99]
        disabled:opacity-60 disabled:cursor-not-allowed
        ${className}
        `}
    >
        {!loading && leftIcon && <span className="shrink-0">{leftIcon}</span>}

        {loading ? (
        <span
            className="
            inline-block w-4 h-4 rounded-full
            border-2 border-violet-200/70 border-t-transparent
            animate-spin
            "
            aria-hidden="true"
        />
        ) : (
        <span className="text-sm whitespace-nowrap select-none">{label}</span>
        )}

        {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>

    {showError && (
        <p className="text-red-400 text-sm text-center flex justify-center items-center gap-1">
        <WarningCircle size={16} /> Пожалуйста, заполните все поля.
        </p>
    )}
    </div>
);
};
