import { FC } from "react";
import "@/styles/components/date-input.scss";

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const DateInput: FC<DateInputProps> = ({ value, onChange }) => {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="date-input"
    />
  );
};
