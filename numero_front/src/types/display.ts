export interface DisplayDataRow {
  title: string;
  value: string | number | boolean | undefined;
}

export interface DataSectionProps {
  header: string;
  rows?: DisplayDataRow[];
  children?: React.ReactNode;
} 