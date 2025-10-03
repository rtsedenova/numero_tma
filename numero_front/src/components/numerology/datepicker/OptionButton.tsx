import React from "react";

export interface OptionButtonProps {
selected: boolean;
onClick: () => void;
children: React.ReactNode;
title?: string;
}

export const OptionButton: React.FC<OptionButtonProps> = ({ selected, onClick, children, title }) => (
<li>
    <button
    type="button"
    title={title}
    className={[
        "w-full text-left font-medium px-3 py-2 rounded-md transition-all duration-300 ease-out",
        selected
        ? "bg-gradient-to-r from-violet-600/60 to-fuchsia-600/60 text-white border-violet-600/60 shadow-[0_2px_8px_rgba(139,92,246,0.3)]"
        : "bg-transparent text-neutral-500 border-transparent hover:bg-gradient-to-r hover:from-fuchsia-500/20 hover:via-violet-500/20 hover:to-indigo-500/20"
    ].join(" ")}
    onClick={onClick}
    >
    {children}
    </button>
</li>
);

export default OptionButton;
