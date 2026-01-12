import { useMemo } from "react";
import type { UseCalculatedMaxYearProps } from "../types";

export const useCalculatedMaxYear = ({
maxYear,
futureYearsSpan,
}: UseCalculatedMaxYearProps): number => {
return useMemo(() => {
    const currentYear = new Date().getFullYear();
    const dynamicUpper = currentYear + Math.max(0, futureYearsSpan);
    return Math.max(maxYear, dynamicUpper);
}, [maxYear, futureYearsSpan]);
};

