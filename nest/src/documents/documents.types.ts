export type DocumentStatus = 'safe' | 'soon' | 'expired';

export interface DocumentsFile {
  thresholds: { warningDays: number };
  documents: { id: string; label: string; expiryDate: string }[];
}
