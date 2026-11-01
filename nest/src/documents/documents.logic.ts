import { diffDays } from '../common/utils/date.util';
import { DocumentsFile, DocumentStatus } from './documents.types';

/**
 * Aturan dari mock-documents.json:
 *   daysRemaining <= 0               -> expired (merah)
 *   0 < daysRemaining <= warningDays -> soon    (kuning)
 *   selain itu                       -> safe    (hijau)
 */
export function classify(daysRemaining: number, warningDays: number): DocumentStatus {
  if (daysRemaining <= 0) return 'expired';
  if (daysRemaining <= warningDays) return 'soon';
  return 'safe';
}

/** "Hari ini" dikirim dari luar (ClockService), BUKAN dari field "today" di JSON. */
export function buildDocuments(file: DocumentsFile, today: string) {
  const { warningDays } = file.thresholds;
  const documents = file.documents.map((doc) => {
    const daysRemaining = diffDays(doc.expiryDate, today);
    return { ...doc, daysRemaining, status: classify(daysRemaining, warningDays) };
  });
  return { asOf: today, warningDays, documents };
}
