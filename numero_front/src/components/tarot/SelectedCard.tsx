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
    <div className="text-white/60 text-sm mb-2">Выбранная карта</div>
    <div className="flex items-center gap-3">
        <div className="px-3 py-2 bg-white/5 rounded-lg border border-white/20">
        <span className="text-white font-semibold">
            {selectedIndex + 1}
        </span>
        </div>
        <div className="text-white/80 text-sm font-medium">
        из {totalCards || 78}
        </div>
    </div>
    </div>
);
};
