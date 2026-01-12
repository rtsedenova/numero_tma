import { NumberFrame } from "./NumberFrame";

export interface ResultDisplayProps {
  number: number;
  isMasterNumber: boolean;
  className?: string;
}

export const ResultDisplay = ({
  number,
  isMasterNumber,
  className = "",
}: ResultDisplayProps) => {
  return (
    <div
      className={[
        className,
        "result-display",
        isMasterNumber ? "result-display--master" : "",
      ].join(" ")}
    >
      <div className="mt-6 md:mt-0 flex justify-center">
        <div className="text-[var(--text)] text-2xl md:text-3xl font-semibold tracking-wide text-center">
          Результат
        </div>
      </div>

      <div className="relative mx-auto w-72 md:w-100 mt-3 md:mt-0 mb-8">
        <div className="result-display__frame-container">
          <NumberFrame className="w-full h-auto result-display__frame" />

          <div className="absolute mt-4 inset-0 flex flex-col items-center justify-center">
            <div className="mt-2 relative flex flex-col items-center">
              <div
                className="result-display__number text-7xl md:text-8xl mb-2 font-extrabold tabular-nums leading-none font-[kudry]"
                data-num={number}
              >
                {number}
              </div>

              {isMasterNumber ? (
                <div
                  className="mt-4 px-4 py-1.5 rounded-full text-sm font-medium result-display__master bg-[var(--result-master-bg)] text-[var(--result-master-text)] border border-[var(--result-master-border)]"
                  aria-label="Мастер число"
                >
                  Мастер число
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
