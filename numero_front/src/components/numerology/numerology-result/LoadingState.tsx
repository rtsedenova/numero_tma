export const LoadingState = () => {
  return (
    <div 
      className="mt-6 p-4 rounded-lg border"
      style={{
        borderColor: 'color-mix(in srgb, var(--border) 30%, transparent)',
        background: 'var(--infobox-bg)',
      }}
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-5 h-5 rounded-full animate-spin border-2"
          style={{
            borderColor: 'var(--result-frame-color)',
            borderTopColor: 'transparent',
          }}
        />
        <span className="text-[var(--text)]">Загружаем интерпретацию...</span>
      </div>
    </div>
  );
};
