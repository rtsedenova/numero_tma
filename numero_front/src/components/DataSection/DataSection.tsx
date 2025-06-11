import { type FC } from 'react';
import { List } from '@telegram-apps/telegram-ui';
import { DisplayData, type DisplayDataRow } from '@/components/DisplayData/DisplayData';

interface DataSectionProps {
  header: string;
  rows?: DisplayDataRow[];
  children?: React.ReactNode;
}

export const DataSection: FC<DataSectionProps> = ({ header, rows, children }) => {
  if (!rows && !children) {
    return null;
  }

  return (
    <List>
      {rows && <DisplayData header={header} rows={rows} />}
      {children}
    </List>
  );
}; 