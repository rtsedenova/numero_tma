export interface DateDisplayProps {
  date: string;
}

export const DateDisplay = ({ date }: DateDisplayProps) => {
  return (
    <div>
      <h3 className="text-violet-200 font-semibold mb-3">Выбранная дата:</h3>
      <p className="text-violet-100 text-lg mb-4">{date}</p>
    </div>
  );
};
