import strengthEl from "@/assets/strength.webp";
import weaknessEl from "@/assets/weakness.webp";
import recommendationEl from "@/assets/recommendation.webp";

export interface InfoCardProps {
  title: string;
  items: string[];
  variant: "strength" | "weakness" | "recommendation";
  className?: string;
}

const ICON_BY_VARIANT: Record<InfoCardProps["variant"], string> = {
  strength: strengthEl,
  weakness: weaknessEl,
  recommendation: recommendationEl,
};

export const InfoCard = ({ title, items, variant, className = "" }: InfoCardProps) => {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <div className={["info-card-wrap relative h-full flex flex-col", className].join(" ")}>
      <img
        src={ICON_BY_VARIANT[variant]}
        alt=""
        aria-hidden="true"
        className={[
          "absolute left-1/2 -top-1 z-20 -translate-x-1/2 -translate-y-1/2",
          "w-24 h-24 select-none pointer-events-none",
        ].join(" ")}
      />

        <div
          className={[
            "info-card overflow-hidden shadow-md flex-1 flex flex-col mb-14 md:mb-6",
            `info-card--${variant}`,
            "relative rounded-2xl pt-12 px-3 pb-3 md:pb-6",
            "backdrop-blur-md",
            "border border-transparent",
          ].join(" ")}
        >
        <h6 className="mb-4 text-lg md:text-xl text-center font-bold text-[var(--infocard-title)]">
          {title}
        </h6>

        <ul className="space-y-3 flex-1">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-3">
              <span
                className={[
                  "",
                ].join(" ")}
              />
              <span className="text-sm md:text-base leading-normal font-medium text-[var(--text)]">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
