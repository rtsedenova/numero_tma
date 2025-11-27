import { InfoCard } from "./InfoCard";

export interface RecommendationsSectionProps {
  recommendations: string[];
  className?: string;
}

export const RecommendationsSection = ({
  recommendations,
  className = "",
}: RecommendationsSectionProps) => {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className={`mt-6 ${className}`}>
      <InfoCard
        title="Рекомендации"
        items={recommendations}
        variant="recommendation"
        className="shadow-xl"
      />
    </div>
  );
};
