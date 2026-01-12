export interface Celebrity {
  name: string;
  birth_date: string;
  description: string;
  image_url: string;
}

export interface CelebrityCardProps {
  celebrity: Celebrity;
}

const FALLBACK_IMG = "/assets/application.png";

export const CelebrityCard = ({ celebrity }: CelebrityCardProps) => {
  const imgSrc = `/prediction_mini_app/${celebrity.image_url}`;

  return (
    <article
      className={[
        "celebrity-card",
        "rounded-2xl p-4 md:p-5",
        "flex gap-4 items-start",
        "transition-colors duration-200",
      ].join(" ")}
    >
      <img
        src={imgSrc}
        alt={celebrity.name}
        className={[
          "h-18 w-18 md:h-20 md:w-20",
          "rounded-full object-cover",
          "shrink-0",
          "shadow-sm",
        ].join(" ")}
        loading="lazy"
        onError={(e) => {
          if (e.currentTarget.src.endsWith(FALLBACK_IMG)) return;
          e.currentTarget.src = FALLBACK_IMG;
        }}
      />

      <div className="min-w-0 flex-1">
        <h4
          className={[
            "truncate",
            "text-base md:text-lg font-bold leading-snug",
          ].join(" ")}
        >
          {celebrity.name}
        </h4>

        <p className="mt-0.5 text-sm font-medium">
          {celebrity.birth_date}
        </p>

        <p className="mt-2 text-sm leading-relaxed line-clamp-3">
          {celebrity.description}
        </p>
      </div>
    </article>
  );
};
