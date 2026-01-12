export interface DateDisplayProps {
  date: string;
  className?: string;
}

export const DateDisplay = ({ date, className = "" }: DateDisplayProps) => {
  return (
    <div
      className={[
        "rounded-lg px-4 py-3 mb-4 md:mb-4",
        "bg-[color-mix(in_srgb,var(--el-bg)_85%,transparent)]",
        "ring-1 ring-[var(--border)]",
        className,
      ].join(" ")}
    >
      <div className="text-sm font-medium text-[color:var(--text-secondary)]">
        Выбранная дата
      </div>

      <div className="mt-1 text-xl font-bold text-[color:var(--text)] tabular-nums">
        {date}
      </div>
    </div>
  );
};
