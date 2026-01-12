import { CelebrityCard, type Celebrity } from "./CelebrityCard";

export interface CelebritySectionProps {
  celebrities: Celebrity[];
  number: number;
  className?: string;
}

export const CelebritySection = ({
  celebrities,
  number,
  className = "",
}: CelebritySectionProps) => {
  if (!celebrities || celebrities.length === 0) {
    return null;
  }

  return (
    <div className={`mt-6 ${className}`}>
      <h6 className="text-[var(--text)] mb-6 text-2xl md:text-3xl font-semibold tracking-wide text-center">
        Известные личности с числом {number}
      </h6>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4">
        {celebrities.map((celebrity, index) => (
          <CelebrityCard key={index} celebrity={celebrity} />
        ))}
      </div>
    </div>
  );
};
