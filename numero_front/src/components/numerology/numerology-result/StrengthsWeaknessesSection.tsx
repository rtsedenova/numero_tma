import { InfoCard } from "./InfoCard";

export interface StrengthsWeaknessesSectionProps {
  strengths: string[];
  weaknesses: string[];
  className?: string;
}

export const StrengthsWeaknessesSection = ({
  strengths,
  weaknesses,
  className = "",
}: StrengthsWeaknessesSectionProps) => {
  return (
    <div className={`grid md:grid-cols-2 md:gap-8 items-stretch ${className}`}>
      <InfoCard
        title="Сильные стороны"
        items={strengths}
        variant="strength"
      />
      <InfoCard
        title="Слабые стороны"
        items={weaknesses}
        variant="weakness"
      />
    </div>
  );
};
