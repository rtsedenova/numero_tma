import React from "react";
import { StrengthsWeaknessesSection } from "./StrengthsWeaknessesSection";
import { RecommendationsSection } from "./RecommendationsSection";
import { CelebritySection } from "./CelebritySection";

export interface S3Data {
  title: string;
  description: string;
  strong_points: string[];
  weak_points: string[];
  recommendations: string[];
  famous_people?: Array<{
    name: string;
    birth_date: string;
    description: string;
    image_url: string;
  }>;
}

export interface S3InterpretationProps {
  s3Data: S3Data;
  number: number;
}

export const S3Interpretation: React.FC<S3InterpretationProps> = ({ s3Data, number }) => {
  if (!s3Data) {
    console.log('S3Interpretation: No s3Data provided');
    return null;
  }

  console.log('S3Interpretation: Rendering with data:', s3Data);

  return (
    <div className="mt-4 md:mt-24 rounded-lg">
      <h4 className="text-[var(--text)] text-2xl md:text-3xl font-semibold tracking-wide text-center">
        Интерпретация числа {number}
      </h4>

      {(s3Data.title || s3Data.description) && (
        <div
          className={[
            "mt-6 md:mt-8 mb-16 p-4 rounded-xl",
            "[background:var(--infobox-bg)]",
            "shadow-md",
          ].join(" ")}
        >
          {s3Data.title && (
            <h5 className="font-bold text-xl mb-3 text-[var(--infobox-title)]">
              {s3Data.title}
            </h5>
          )}

          {s3Data.description && (
            <p className="leading-relaxed text-base font-medium text-[var(--infobox-text)]">
              {s3Data.description}
            </p>
          )}
        </div>
      )}

      {(s3Data.strong_points?.length || s3Data.weak_points?.length) && (
        <StrengthsWeaknessesSection 
          strengths={s3Data.strong_points || []}
          weaknesses={s3Data.weak_points || []}
        />
      )}

      {s3Data.recommendations && s3Data.recommendations.length > 0 && (
        <RecommendationsSection recommendations={s3Data.recommendations} />
      )}

      {s3Data.famous_people && s3Data.famous_people.length > 0 && (
        <CelebritySection 
          celebrities={s3Data.famous_people as Array<{ name: string; birth_date: string; description: string; image_url: string; }>}
          number={number}
        />
      )}
    </div>
  );
};
