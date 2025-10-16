import React from 'react';

interface TarotCardProps {
  index: number;
}

export const TarotCard: React.FC<TarotCardProps> = () => {
  return (
    <div 
      className="bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-400 rounded-lg shadow-lg flex items-center justify-center"
      style={{ 
        width: '80px',
        height: '141.2px',
        aspectRatio: '1 / 1.765'
      }}
    >
    </div>
  );
};