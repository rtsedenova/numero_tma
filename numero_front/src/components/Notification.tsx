import { FC } from "react";
import { Bell } from "phosphor-react";

export interface NotificationIconProps {
  hasUnread?: boolean;
  size?: number;
  className?: string;
}

export const NotificationIcon: FC<NotificationIconProps> = ({
  hasUnread = true,
  size = 28,
  className = "",
}) => {
  return (
    <div className={`relative inline-flex items-center group ${className}`}>
      <Bell
        size={size}
        weight="regular"
        className="
          bell-icon
          text-violet-200
          transition-colors duration-300
          group-hover:text-violet-300
          drop-shadow-[0_0_6px_rgba(196,181,253,0.35)]
          cursor-pointer
        "
      />

      {hasUnread && (
        <span
          aria-hidden
          className="
            absolute top-0 right-0
            h-2 w-2 rounded-full
            bg-rose-400 shadow-sm pointer-events-none
            transition-all duration-300
            ring-0 ring-transparent
            group-hover:ring-[3px] group-hover:ring-rose-400/30
            group-hover:shadow-[0_0_6px_rgba(244,63,94,0.35)]
          "
        />
      )}
    </div>
  );
};
