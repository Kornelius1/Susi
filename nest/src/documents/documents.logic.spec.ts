import { loadJson } from '../common/utils/load-json';
import { buildDocuments, classify } from './documents.logic';
import { DocumentsFile } from './documents.types';

const file = loadJson<DocumentsFile>('mock-documents.json');
const at = (today: string) =>
  Object.fromEntries(buildDocuments(file, today).documents.map((d) => [d.id, d]));

describe('buildDocuments (data asli, today = 2026-05-15)', () => {
  const docs = at('2026-05-15');

  it('sudah lewat -> expired', () => {
    expect(docs.doc_security.daysRemaining).toBe(-14);
    expect(docs.doc_security.status).toBe('expired');
  });

  it('dalam 30 hari -> soon', () => {
    expect(docs.doc_license.daysRemaining).toBe(14);
    expect(docs.doc_license.status).toBe('soon');
    expect(docs.doc_medical.daysRemaining).toBe(27);
    expect(docs.doc_medical.status).toBe('soon');
  });

  it('lebih dari 30 hari -> safe', () => {
    expect(docs.doc_recurrent.status).toBe('safe');
    expect(docs.doc_ppc.status).toBe('safe');
  });

  it('mempertahankan 5 dokumen sesuai urutan JSON, dan hasil mengikuti hari yang diberikan', () => {
    const r = buildDocuments(file, '2026-05-15');
    expect(r.documents.map((d) => d.id)).toEqual([
      'doc_recurrent',
      'doc_ppc',
      'doc_license',
      'doc_medical',
      'doc_security',
    ]);
    expect(r.asOf).toBe('2026-05-15');
    expect(r.warningDays).toBe(30);
  });

  it('field "today" di JSON (2026-05-31) tidak dipakai', () => {
    // Jika JSON today dipakai, license (29 Mei) akan expired. Dengan 15 Mei harus soon.
    expect(docs.doc_license.status).toBe('soon');
  });
});

describe('classify (batas)', () => {
  it('0 hari (hari kedaluwarsa itu sendiri) sudah expired', () => {
    expect(classify(0, 30)).toBe('expired');
    expect(classify(-1, 30)).toBe('expired');
  });
  it('1 hari dan tepat 30 hari -> soon; 31 hari -> safe', () => {
    expect(classify(1, 30)).toBe('soon');
    expect(classify(30, 30)).toBe('soon');
    expect(classify(31, 30)).toBe('safe');
  });
  it('tanggal nyata di sekitar batas (license kedaluwarsa 29 Mei)', () => {
    expect(at('2026-05-29').doc_license.status).toBe('expired');
    expect(at('2026-04-29').doc_license.status).toBe('soon'); // 30 hari
    expect(at('2026-04-28').doc_license.status).toBe('safe'); // 31 hari
  });
});
