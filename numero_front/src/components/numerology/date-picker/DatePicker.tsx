import React, { useState, useRef, useCallback, useMemo } from "react";
import { DateField } from "./calendar/DateField";
import { Popover } from "./calendar/Popover";
import { CalendarPanel } from "./calendar/CalendarPanel";
import { useDateStore } from "../../../storage/dateStore";

export interface DatePickerProps {
  value?: string | null;
  onChange?: (iso: string | null) => void;
  minYear?: number;
  maxYear?: number;
  futureYearsSpan?: number;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minYear = 1900,
  maxYear = 2025,
  futureYearsSpan = 50,
  className = "",
}) => {
  const { selectedDate, setSelectedDate } = useDateStore();
  const [isOpen, setIsOpen] = useState(false);
  const fieldRef = useRef<HTMLButtonElement>(null);

  const currentValue = useMemo(() => value ?? selectedDate, [value, selectedDate]);

  const handleSelect = useCallback((iso: string | null, shouldClose: boolean = false) => {
    onChange?.(iso);
    setSelectedDate(iso);
    if (shouldClose) {
      setIsOpen(false);
    }
  }, [onChange, setSelectedDate]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleToggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <DateField
        ref={fieldRef}
        value={currentValue}
        onClick={handleToggleOpen}
      />
      <Popover
        isOpen={isOpen}
        onClose={handleClose}
        anchorRef={fieldRef}
      >
        <CalendarPanel
          value={currentValue}
          onSelect={handleSelect}
          onCancel={handleCancel}
          minYear={minYear}
          maxYear={maxYear}
          futureYearsSpan={futureYearsSpan}
        />
      </Popover>
    </div>
  );
};

export default DatePicker;
