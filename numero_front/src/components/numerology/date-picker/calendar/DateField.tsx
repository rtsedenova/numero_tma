import React from "react";
import { CalendarBlank } from "phosphor-react";
import { formatDate } from "./utils";
import type { DateFieldProps } from "./types";

const DateFieldComponent = React.forwardRef<HTMLButtonElement, DateFieldProps>(({
value,
onClick,
placeholder = "Выберите дату",
className = "",
}, ref) => {
return (
    <button
    ref={ref}
    type="button"
    onClick={onClick}
    className={[
        "group w-full rounded-lg bg-[var(--el-bg)] px-4 py-3",
        "transition-all duration-200 ease-out",
        "hover:brightness-110", 
        "ring-1 ring-[var(--border)]",
        "flex items-center justify-between",
        className,
    ].join(" ")}
    aria-label="Выберите дату"
    aria-haspopup="dialog"
    >
    <span className="flex items-center gap-3">
        <CalendarBlank
        className="shrink-0 w-5 h-5 md:w-6 md:h-6 text-purple-400 group-hover:text-purple-500 transition-colors"
        aria-hidden="true"
        />
        <span
        className={[
            "text-sm font-medium leading-5",
            value ? "text-[var(--text)]" : "text-[var(--text-subtle)]",
        ].join(" ")}
        >
        {value ? formatDate(value) : placeholder}
        </span>
    </span>
    <span className="text-xs text-[var(--text-subtle)]">
        {value ? "Изменить" : "Выбрать"}
    </span>
    </button>
);
});

DateFieldComponent.displayName = "DateField";

export const DateField = React.memo(
DateFieldComponent as React.ForwardRefExoticComponent<DateFieldProps & React.RefAttributes<HTMLButtonElement>>,
(prevProps, nextProps) => {
    return (
    prevProps.value === nextProps.value &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.className === nextProps.className
    );
}
) as typeof DateFieldComponent;

export default DateField;

