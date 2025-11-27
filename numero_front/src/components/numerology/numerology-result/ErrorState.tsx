export interface ErrorStateProps {
  error: string;
}

export const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <div className="mt-6 p-4 rounded-lg border border-red-400/20 bg-red-500/5">
      <div className="flex items-center gap-3">
        <span className="text-red-400 text-lg">⚠️</span>
        <div>
          <p className="text-red-200 font-medium">Ошибка загрузки интерпретации</p>
          <p className="text-red-300 text-sm mt-1">{error}</p>
        </div>
      </div>
    </div>
  );
};
