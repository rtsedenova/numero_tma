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
    <div className="mt-4 rounded-lg">
      <h4 className="text-violet-300 font-semibold mb-4 text-lg">Интерпретация числа {number}:</h4>

      {(s3Data.title || s3Data.description) && (
        <div className="mb-6 p-4 rounded-xl shadow-md bg-gradient-to-br from-violet-300/15 to-fuchsia-600/10">
          {s3Data.title && (
            <h5 className="text-violet-100 font-bold text-xl mb-3 bg-gradient-to-r from-violet-200 to-indigo-200 bg-clip-text">
              {s3Data.title}
            </h5>
          )}
          {s3Data.description && (
            <p className="text-violet-100/90 leading-relaxed text-base font-medium">
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
          celebrities={s3Data.famous_people}
          number={number}
        />
      )}
    </div>
  );
};
