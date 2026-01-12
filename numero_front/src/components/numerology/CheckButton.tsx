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
    onDateCheck?.(selectedDate);
    onClick?.();
};

return (
    <div className="flex flex-col gap-2">
    <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={[
        "inline-flex items-center justify-center gap-2",
        "px-4 py-2 rounded-full",
        "[background-image:var(--gradient-bg)]",
        "transition-all duration-300 ease-out",
        "hover:[background-image:var(--gradient-bg-hover)]",
        "active:scale-[0.99]",
        "disabled:opacity-60 disabled:cursor-not-allowed",

        "text-[var(--button-text)]",

        className,
        ].join(" ")}
    >
        {!loading && leftIcon && <span className="shrink-0">{leftIcon}</span>}

        {loading ? (
        <div
            className="w-5 h-5 border-2 border-purple-300/30 border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
        />
        ) : (
        <span className="text-sm font-medium whitespace-nowrap select-none">
            {label}
        </span>
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
