import type { NumerologyResultData } from "@/helpers/calculateNumerologyNumber";
import type { DestinyNumberData } from "@/types/destiny";
import { getDetailedCalculationSteps } from "@/helpers/getDetailedCalculationSteps";
import { DateDisplay } from "./DateDisplay";
import { CalculationSteps } from "./CalculationSteps";
import { ResultDisplay } from "./ResultDisplay";
import { LoadingState } from "./LoadingState";
import { StrengthsWeaknessesSection } from "./StrengthsWeaknessesSection";
import { RecommendationsSection } from "./RecommendationsSection";
import { CelebritySection } from "./CelebritySection";

export interface NumerologyResultProps {
  date: string;
  result: NumerologyResultData;
  interpretation?: DestinyNumberData | null;
  isLoadingInterpretation?: boolean;
}

export const NumerologyResult = ({
  date,
  result,
  interpretation,
  isLoadingInterpretation = false,
}: NumerologyResultProps) => {
  const detailedSteps = getDetailedCalculationSteps(result, date);

  const isLoading = isLoadingInterpretation;
  const interpretationToShow = !isLoading ? interpretation : null;

  return (
    <div className="mt-4">
      <div className="space-y-3 md:flex md:flex-row md:gap-6 md:items-start md:space-y-0">
        <div className="flex flex-col space-y-3 md:space-y-2 md:w-1/2">
          <DateDisplay date={date} />

          <CalculationSteps steps={detailedSteps} />

          <div className="md:hidden">
            <ResultDisplay number={result.number} isMasterNumber={result.isMasterNumber} />
            {isLoading && <LoadingState />}
          </div>

          {interpretationToShow && (
            <div className="mt-4 md:mt-0 rounded-lg">
              <h4 className="text-[var(--text)] text-2xl md:text-xl font-semibold tracking-wide text-center">
                Интерпретация числа {result.number}
              </h4>

              {(interpretationToShow.title || interpretationToShow.description) && (
                <div
                  className={[
                    "mt-6 md:mt-4 mb-16 md:mb-0 p-4 md:p-3 rounded-xl",
                    "[background:var(--infobox-bg)]",
                    "shadow-md",
                  ].join(" ")}
                >
                  {interpretationToShow.title && (
                    <h5 className="font-bold text-xl md:text-lg mb-3 md:mb-2 text-[var(--infobox-title)]">
                      {interpretationToShow.title}
                    </h5>
                  )}

                  {interpretationToShow.description && (
                    <p className="leading-relaxed text-base md:text-sm font-medium text-[var(--infobox-text)]">
                      {interpretationToShow.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden md:block md:w-1/2">
          <ResultDisplay number={result.number} isMasterNumber={result.isMasterNumber} />
          {isLoading && <LoadingState />}
        </div>
      </div>

      {interpretationToShow && (
        <div className="mt-4 md:mt-16">
          {(interpretationToShow.strong_points?.length || interpretationToShow.weak_points?.length) && (
            <StrengthsWeaknessesSection 
              strengths={interpretationToShow.strong_points || []}
              weaknesses={interpretationToShow.weak_points || []}
            />
          )}

          {interpretationToShow.recommendations && interpretationToShow.recommendations.length > 0 && (
            <RecommendationsSection recommendations={interpretationToShow.recommendations} />
          )}

          {interpretationToShow.famous_people && interpretationToShow.famous_people.length > 0 && (
            <CelebritySection 
              celebrities={interpretationToShow.famous_people as Array<{ name: string; birth_date: string; description: string; image_url: string; }>}
              number={result.number}
            />
          )}
        </div>
      )}
    </div>
  );
};
