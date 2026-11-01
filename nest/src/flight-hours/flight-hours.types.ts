export const RANGE_KEYS = ['1w', '1m', '3m', '6m', '1y'] as const;
export type RangeKey = (typeof RANGE_KEYS)[number];

export interface FlightHoursFile {
  pilot: { name: string; totalFlightHours: number };
  limits: { daily: number; weekly: number; monthly: number; annual: number };
  chartBounds: Record<
    RangeKey,
    { limit: number; max: number; windowDays: number; displayRangeDays: number }
  >;
  flightHours: { date: string; hours: number }[];
}

export type CardStatus = 'safe' | 'warning' | 'over';

export interface LimitCard {
  key: 'daily' | 'weekly' | 'monthly' | 'annual';
  label: string;
  windowDays: number;
  limit: number;
  hours: number;
  remaining: number;
  percent: number;
  status: CardStatus;
}

export interface SummaryPoint {
  date: string;
  hours: number;
  rollingSum: number;
  isToday: boolean;
  isFuture: boolean;
  overLimit: boolean;
}

export interface SummaryResponse {
  range: RangeKey;
  asOf: string;
  windowDays: number;
  limit: number;
  yMax: number;
  points: SummaryPoint[];
  cards: LimitCard[];
}
