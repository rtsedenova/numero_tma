import React from 'react';

interface Props {
selectedIndex?: number | null;
totalCards?: number;
}

export const SelectedCard: React.FC<Props> = ({ selectedIndex, totalCards }) => {
if (selectedIndex === null || selectedIndex === undefined) {
    return null;
}

return (
    <div className="flex flex-col items-center">
    <div className="text-[var(--text-subtle)] text-sm mb-3 font-medium tracking-wide">
        Выбранная карта
    </div>
    <div className="flex items-center gap-3">
        <div 
        className="px-3 py-2 rounded-xl border backdrop-blur-sm shadow-lg transition-all"
        style={{
            background: 'var(--el-bg)',
            borderColor: 'var(--border)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 1px var(--border)',
        }}
        >
        <span 
            className="font-bold text-lg"
            style={{
            background: 'var(--result-number-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            }}
        >
            {selectedIndex + 1}
        </span>
        </div>
        <div className="text-[var(--text-secondary)] text-sm font-medium">
        из {totalCards || 78}
        </div>
    </div>
    </div>
);
};
