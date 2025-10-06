import React from "react";
import { CaretCircleDown } from "phosphor-react";

export interface BaseSelectProps {
label: string;
isOpen: boolean;
onToggle: () => void;
displayValue: string;
children: React.ReactNode;
}

export const BaseSelect: React.FC<BaseSelectProps> = ({
label,
isOpen,
onToggle,
displayValue,
children,
}) => {
const hasValue = displayValue.trim().length > 0;

return (
    <div className="relative">
    <button
        type="button"
        onClick={onToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={[
        // base
        "group w-full rounded-xl bg-white/90 px-3 py-2 text-neutral-700 shadow-sm",
        "transition-all duration-200 ease-out",
        // hover/active
        "hover:bg-white hover:shadow-[0_8px_24px_rgba(139,92,246,0.18)]",
        "active:translate-y-[1px] active:shadow-[0_4px_14px_rgba(139,92,246,0.22)]",
        ].join(" ")}
    >
        <span className="flex items-center justify-between">
        <span className="text-sm font-semibold text-neutral-700">{label}</span>

        <CaretCircleDown
            className={[
            "shrink-0 w-5 h-5 md:w-6.5 md:h-6.5 transition-transform duration-200 ease-out",
            isOpen ? "rotate-180" : "",
            // icon color + color change on hover
            "text-violet-600 group-hover:text-violet-700",
            ].join(" ")}
            aria-hidden="true"
        />
        </span>

        <span
        className={[
            "mt-0.5 block h-5 text-sm font-medium leading-5",
            hasValue ? "text-neutral-600" : "text-neutral-400",
        ].join(" ")}
        >
        {hasValue ? displayValue : "—"}
        </span>
    </button>

    {isOpen && (
        <div
        className={[
            "absolute left-0 right-0 z-50 mt-2 w-full",
            "rounded-xl bg-white/95 backdrop-blur-md",
            "shadow-xl shadow-violet-500/10",
            // compact window, up to ~6 items visible; the rest is scrollable
            "max-h-56 overflow-y-auto",
            // small inner padding
            "p-1",
        ].join(" ")}
        role="listbox"
        >
        <ul className="space-y-1 text-sm leading-tight">{children}</ul>
        </div>
    )}
    </div>
);
};

export default BaseSelect;
