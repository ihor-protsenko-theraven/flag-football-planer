export interface AdminStat {
  title: string;
  value: number | string;
  icon: string;
  trend?: number;
  trendDirection?: 'up' | 'down';
}
