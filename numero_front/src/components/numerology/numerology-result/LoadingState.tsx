export const LoadingState = () => {
  return (
    <div className="mt-6 p-4 rounded-lg border border-violet-400/20 bg-violet-500/5">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-violet-300 border-t-transparent rounded-full animate-spin" />
        <span className="text-violet-200">Загружаем интерпретацию...</span>
      </div>
    </div>
  );
};
