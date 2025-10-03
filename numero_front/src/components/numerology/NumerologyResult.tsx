import React, { useEffect } from "react";
import { NumerologyResultData } from "@/helpers/calculateNumerologyNumber";
import { getDetailedCalculationSteps } from "@/helpers/getDetailedCalculationSteps";
import { useNumerologyS3Data } from "@/hooks/useNumerologyS3Data";

export interface NumerologyResultProps {
date: string;
result: NumerologyResultData;
}

export const NumerologyResult: React.FC<NumerologyResultProps> = ({
date,
result
}) => {
const detailedSteps = getDetailedCalculationSteps(result, date);
const { data: s3Data, isLoading: isS3Loading, error: s3Error, fetchData } = useNumerologyS3Data();

// Fetch S3 data when component mounts with a result
useEffect(() => {
  if (result?.number) {
    fetchData(result.number);
  }
}, [result?.number, fetchData]);

return (
    <div className="mt-4 p-4 rounded-lg border border-violet-300/30 bg-violet-500/5">
    <h3 className="text-violet-200 font-semibold mb-3">Выбранная дата:</h3>
    <p className="text-violet-100 text-lg mb-4">{date}</p>
    
    <div className="space-y-3">
        <div>
        <h4 className="text-violet-300 font-medium mb-2">Полный расчёт нумерологического числа:</h4>
        <div className="bg-violet-500/10 p-3 rounded border border-violet-400/20">
            {detailedSteps.map((step, index) => (
            <div key={index} className="text-violet-100 font-mono text-sm">
                <span>
                {step.formula} = <span className="text-violet-200 font-semibold">{step.result}</span>
                {step.isMasterNumber && (
                    <span className="text-yellow-300 ml-2">(мастер-число)</span>
                )}
                </span>
            </div>
            ))}
        </div>
        </div>
        
        <div>
        <h4 className="text-violet-300 font-medium mb-2">Результат:</h4>
        <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold px-3 py-1 rounded-full border-2 ${
            result.isMasterNumber 
                ? 'text-yellow-300 border-yellow-300/50 bg-yellow-500/10' 
                : 'text-violet-200 border-violet-300/50 bg-violet-500/10'
            }`}>
            {result.number}
            </span>
            {result.isMasterNumber && (
            <span className="text-yellow-300 text-sm font-medium">
                Мастер-число
            </span>
            )}
        </div>
        </div>

        {/* S3 Data Block */}
        {s3Data && (
          <div className="mt-6">
            <h4 className="text-violet-300 font-medium mb-3">Интерпретация числа {result.number}:</h4>
            <div className="bg-gradient-to-r from-violet-500/10 to-indigo-500/10 p-4 rounded-lg border border-violet-400/20">
              <h5 className="text-violet-200 font-semibold text-lg mb-3">{s3Data.title}</h5>
              <p className="text-violet-100 mb-4 leading-relaxed">{s3Data.description}</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Strong Points */}
                <div className="bg-green-500/10 p-3 rounded border border-green-400/20">
                  <h6 className="text-green-300 font-medium mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Сильные стороны
                  </h6>
                  <ul className="text-violet-100 text-sm space-y-1">
                    {s3Data.strong_points.map((point: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weak Points */}
                <div className="bg-orange-500/10 p-3 rounded border border-orange-400/20">
                  <h6 className="text-orange-300 font-medium mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                    Слабые стороны
                  </h6>
                  <ul className="text-violet-100 text-sm space-y-1">
                    {s3Data.weak_points.map((point: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-orange-400 mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div className="mt-4 bg-blue-500/10 p-3 rounded border border-blue-400/20">
                <h6 className="text-blue-300 font-medium mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Рекомендации
                </h6>
                <ul className="text-violet-100 text-sm space-y-1">
                  {s3Data.recommendations.map((recommendation: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Famous People */}
              {s3Data.famous_people && s3Data.famous_people.length > 0 && (
                <div className="mt-4">
                  <h6 className="text-purple-300 font-medium mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    Известные личности с числом {result.number}
                  </h6>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {s3Data.famous_people.map((person, index: number) => (
                      <div key={index} className="bg-purple-500/10 p-3 rounded border border-purple-400/20">
                        <div className="flex items-start gap-3">
                          <img
                            src={`/prediction_mini_app/${person.image_url}`}
                            alt={person.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-purple-400/30"
                            onError={(e) => {
                              e.currentTarget.src = '/assets/application.png';
                            }}
                          />
                          <div className="flex-1">
                            <div className="text-purple-200 font-medium text-sm">{person.name}</div>
                            <p className="text-violet-100 text-xs opacity-80">{person.birth_date}</p>
                            <p className="text-violet-100 text-xs mt-1">{person.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* S3 Loading State */}
        {isS3Loading && (
          <div className="mt-6 p-4 rounded-lg border border-violet-400/20 bg-violet-500/5">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-violet-300 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-violet-200">Загружаем интерпретацию...</span>
            </div>
          </div>
        )}

        {/* S3 Error State */}
        {s3Error && (
          <div className="mt-6 p-4 rounded-lg border border-red-400/20 bg-red-500/5">
            <div className="flex items-center gap-3">
              <span className="text-red-400 text-lg">⚠️</span>
              <div>
                <p className="text-red-200 font-medium">Ошибка загрузки интерпретации</p>
                <p className="text-red-300 text-sm mt-1">{s3Error}</p>
              </div>
            </div>
          </div>
        )}
    </div>
    </div>
);
};
