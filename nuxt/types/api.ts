// Bentuk respons API (cocok dengan backend NestJS).

export type RangeKey = '1w' | '1m' | '3m' | '6m' | '1y'

export interface LoginResponse {
  accessToken: string
  tokenType: 'Bearer'
}

export interface PilotProfile {
  name: string
  totalFlightHours: number
  avatarUrl: string
}

export type CardStatus = 'safe' | 'warning' | 'over'

export interface LimitCard {
  key: 'daily' | 'weekly' | 'monthly' | 'annual'
  label: string
  windowDays: number
  limit: number
  hours: number
  remaining: number
  percent: number
  status: CardStatus
}

export interface SummaryPoint {
  date: string
  hours: number
  rollingSum: number
  isToday: boolean
  isFuture: boolean
  overLimit: boolean
}

export interface SummaryResponse {
  range: RangeKey
  asOf: string
  windowDays: number
  limit: number
  yMax: number
  points: SummaryPoint[]
  cards: LimitCard[]
}

export type DocumentStatus = 'safe' | 'soon' | 'expired'

export interface DocumentItem {
  id: string
  label: string
  expiryDate: string
  daysRemaining: number
  status: DocumentStatus
}

export interface DocumentsResponse {
  asOf: string
  warningDays: number
  documents: DocumentItem[]
}

export interface LegendItem {
  code: string
  label: string
  color: string
}

export interface ScheduleEntry {
  id: string
  duty_date: string
  status: number
  base_name: string
  base_color: string
  duty_type: string
  count_schedules: number
  count_logbooks: number
  is_complete: boolean
  count_remaining: number
}

export interface SchedulesResponse {
  today: string
  year: number
  month: number
  legend: LegendItem[]
  entries: ScheduleEntry[]
}

/** Bentuk error seragam dari global exception filter backend. */
export interface ApiErrorBody {
  statusCode: number
  error: string
  message: string
  details: string[]
}
