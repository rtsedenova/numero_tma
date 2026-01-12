import React from "react";
import { BUTTON_STYLES } from "./constants";
import type { CalendarFooterProps } from "./types";

const CalendarFooterComponent: React.FC<CalendarFooterProps> = ({
  hasValue,
  onClear,
  onCancel,
  onOk,
  className = "",
}) => {
  return (
    <div
      className={[
        "flex items-center justify-between gap-2 px-4 py-3",
        "border-t border-[color:var(--text-subtle)]",
        className,
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onClear}
        disabled={!hasValue}
        className={[
          BUTTON_STYLES.BASE,
          hasValue ? BUTTON_STYLES.CLEAR_ENABLED : BUTTON_STYLES.DISABLED,
        ].join(" ")}
      >
        Очистить
      </button>

      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className={BUTTON_STYLES.CANCEL}>
          Отмена
        </button>

        <button type="button" onClick={onOk} className={BUTTON_STYLES.OK_BASE}>
          OK
        </button>
      </div>
    </div>
  );
};

export const CalendarFooter = React.memo(
  CalendarFooterComponent,
  (prevProps, nextProps) =>
    prevProps.hasValue === nextProps.hasValue &&
    prevProps.className === nextProps.className
);

CalendarFooter.displayName = "CalendarFooter";

export default CalendarFooter;
