import React from 'react';

interface TarotStageProps {
  children: React.ReactNode;
}

export const TarotStage: React.FC<TarotStageProps> = ({ children }) => {
  return (
    <div
      className="fixed inset-0 overflow-hidden bg-gradient-to-b from-indigo-900 to-purple-900
                flex items-end justify-center"
      style={{
        overscrollBehavior: 'none',   
        touchAction: 'none',          
      }}
    >
      {children}
    </div>
  );
};