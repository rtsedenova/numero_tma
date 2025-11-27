export interface InfoCardProps {
  title: string;
  items: string[];
  variant: "strength" | "weakness" | "recommendation";
  className?: string;
}

const variantStyles = {
  strength: {
    container: "bg-gradient-to-br from-emerald-500/15 to-green-500/10",
    title: "text-emerald-200",
    dot: "text-emerald-500",
    icon: "bg-gradient-to-r from-emerald-400 to-green-400",
    shadow: "shadow-emerald-500/20",
  },
  weakness: {
    container: "bg-gradient-to-br from-amber-500/15 to-orange-500/10",
    title: "text-amber-200",
    dot: "text-amber-500",
    icon: "bg-gradient-to-r from-amber-400 to-orange-400",
    shadow: "shadow-amber-500/20",
  },
  recommendation: {
    container: "bg-gradient-to-br from-blue-500/15 to-indigo-500/10",
    title: "text-blue-200",
    dot: "text-blue-500",
    icon: "bg-gradient-to-r from-blue-400 to-indigo-400",
    shadow: "shadow-blue-500/20",
  },
};

export const InfoCard = ({
  title,
  items,
  variant,
  className = "",
}: InfoCardProps) => {
  const styles = variantStyles[variant];

  if (!items || !Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <div className={`p-5 rounded-2xl ${styles.container} ${className}`}>
      <h6 className={`${styles.title} font-bold mb-4 flex items-center gap-3 text-lg`}>
        {title}
      </h6>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3 group">
            <span className={`${styles.dot} text-xl leading-none`}>•</span>
            <span className="text-violet-100 text-sm leading-relaxed font-medium">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
