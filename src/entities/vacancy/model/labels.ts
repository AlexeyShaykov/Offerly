import type { VacancySource, VacancyStatus, WorkFormat } from '@prisma/client';

export const STATUS_LABELS: Record<VacancyStatus, string> = {
  SAVED: 'Saved',
  APPLIED: 'Applied',
  SCREENING: 'Screening',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
  ARCHIVED: 'Archived',
};

export const SOURCE_LABELS: Record<VacancySource, string> = {
  HH: 'hh.ru',
  TELEGRAM: 'Telegram',
  LINKEDIN: 'LinkedIn',
  REFERRAL: 'Referral',
  OTHER: 'Other',
};

export const WORK_FORMAT_LABELS: Record<WorkFormat, string> = {
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
  OFFICE: 'Office',
};
