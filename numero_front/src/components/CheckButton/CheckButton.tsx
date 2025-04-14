import { FC } from "react";
import "@/styles/components/check-button.scss";

interface CheckButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export const CheckButton: FC<CheckButtonProps> = ({ onClick, disabled, isLoading }) => {
  return (
    <button className="check-button" onClick={onClick} disabled={disabled}>
      {isLoading ? "Загрузка..." : "Рассчитать число судьбы"}
    </button>
  );
};
