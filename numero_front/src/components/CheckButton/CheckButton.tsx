import { FC } from "react";

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
