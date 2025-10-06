import React from "react";
import { InfoCard } from "./InfoCard";

export interface StrengthsWeaknessesSectionProps {
  strengths: string[];
  weaknesses: string[];
  className?: string;
}

export const StrengthsWeaknessesSection: React.FC<StrengthsWeaknessesSectionProps> = ({ 
  strengths, 
  weaknesses, 
  className = "" 
}) => {
  return (
    <div className={`grid md:grid-cols-2 gap-6 ${className}`}>
      <InfoCard
        title="Сильные стороны"
        items={strengths}
        variant="strength"
        className="shadow-md"
      />
      <InfoCard
        title="Слабые стороны"
        items={weaknesses}
        variant="weakness"
        className="shadow-md"
      />
    </div>
  );
};
