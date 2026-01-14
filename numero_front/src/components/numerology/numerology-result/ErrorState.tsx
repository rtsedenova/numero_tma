export interface ErrorStateProps {
  error: string;
}

export const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <div 
      className="mt-6 p-4 rounded-lg border"
      style={{
        borderColor: 'var(--error-border)',
        background: 'var(--error-bg)',
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">⚠️</span>
        <div>
          <p 
            className="font-medium"
            style={{ color: 'var(--error-title)' }}
          >
            Ошибка загрузки интерпретации
          </p>
          <p 
            className="text-sm mt-1"
            style={{ color: 'var(--error-text)' }}
          >
            {error}
          </p>
        </div>
      </div>
    </div>
  );
};
