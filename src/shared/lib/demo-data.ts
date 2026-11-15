import 'server-only';

import { VacancyStatus, type Prisma, type VacancySource, type WorkFormat } from '@prisma/client';

// Demo data shown to new users (when DEMO_DATA_ON_SIGNUP=true) and used by `pnpm db:seed`.
// It only needs Prisma types, so it is safe to live in shared and be reused by the seed script.

const DAY_MS = 24 * 60 * 60 * 1000;

export type SeedCompany = { key: string; name: string; website?: string; notes?: string };

export type SeedVacancy = {
  company?: string;
  title: string;
  url?: string;
  source: VacancySource;
  workFormat: WorkFormat;
  salaryFrom?: number;
  salaryTo?: number;
  description?: string;
  // Status path from the first one to the current one.
  path: VacancyStatus[];
  // Days ago the vacancy was saved.
  savedDaysAgo: number;
  // Days between consecutive status changes.
  stepDays: number;
  coverLetter?: string;
};

export const companies: SeedCompany[] = [
  {
    key: 'yandex',
    name: 'Yandex',
    website: 'https://yandex.ru',
    notes: 'Large product company, multi-stage hiring.',
  },
  {
    key: 'tinkoff',
    name: 'T-Bank',
    website: 'https://tbank.ru',
    notes: 'Strong frontend community.',
  },
  { key: 'ozon', name: 'Ozon', website: 'https://ozon.ru' },
  {
    key: 'jetbrains',
    name: 'JetBrains',
    website: 'https://jetbrains.com',
    notes: 'Remote-friendly, English required.',
  },
  { key: 'skyeng', name: 'Skyeng', website: 'https://skyeng.ru' },
  { key: 'startup', name: 'Nimbus Labs', notes: 'Early-stage startup, referral from a friend.' },
];

const { SAVED, APPLIED, SCREENING, INTERVIEW, OFFER, REJECTED, ARCHIVED } = VacancyStatus;

export const vacancies: SeedVacancy[] = [
  {
    company: 'yandex',
    title: 'Frontend Developer (Next.js)',
    url: 'https://hh.ru/vacancy/1001',
    source: 'HH',
    workFormat: 'HYBRID',
    salaryFrom: 250000,
    salaryTo: 350000,
    description: 'Build internal dashboards with Next.js and TypeScript. Code review, tests, CI.',
    path: [SAVED, APPLIED, SCREENING, INTERVIEW],
    savedDaysAgo: 28,
    stepDays: 5,
    coverLetter:
      'Hello! I have been building production React applications for several years and recently moved to the Next.js App Router. I would be glad to bring this experience to your dashboards team.',
  },
  {
    company: 'tinkoff',
    title: 'Senior React Developer',
    url: 'https://hh.ru/vacancy/1002',
    source: 'HH',
    workFormat: 'REMOTE',
    salaryFrom: 300000,
    salaryTo: 420000,
    description: 'Own the web banking frontend, mentor middle developers.',
    path: [SAVED, APPLIED, SCREENING, INTERVIEW, OFFER],
    savedDaysAgo: 45,
    stepDays: 7,
    coverLetter:
      'Hi! I enjoy owning complex frontends end to end and helping teammates grow. Your web banking product looks like a great place to do both.',
  },
  {
    company: 'ozon',
    title: 'Frontend Engineer, Marketplace',
    url: 'https://hh.ru/vacancy/1003',
    source: 'HH',
    workFormat: 'OFFICE',
    salaryFrom: 220000,
    salaryTo: 300000,
    path: [SAVED, APPLIED, REJECTED],
    savedDaysAgo: 40,
    stepDays: 6,
  },
  {
    company: 'jetbrains',
    title: 'Web Developer, Account Portal',
    url: 'https://linkedin.com/jobs/view/2001',
    source: 'LINKEDIN',
    workFormat: 'REMOTE',
    salaryFrom: 350000,
    salaryTo: 480000,
    description: 'Customer-facing portal, TypeScript, React, strong English.',
    path: [SAVED, APPLIED, SCREENING],
    savedDaysAgo: 21,
    stepDays: 4,
  },
  {
    company: 'skyeng',
    title: 'Middle+ Frontend Developer',
    url: 'https://hh.ru/vacancy/1005',
    source: 'HH',
    workFormat: 'REMOTE',
    salaryFrom: 200000,
    salaryTo: 280000,
    path: [SAVED, APPLIED, SCREENING, REJECTED],
    savedDaysAgo: 35,
    stepDays: 4,
  },
  {
    company: 'startup',
    title: 'Founding Frontend Engineer',
    source: 'REFERRAL',
    workFormat: 'HYBRID',
    salaryFrom: 180000,
    salaryTo: 260000,
    description: 'Greenfield product, equity included.',
    path: [SAVED, APPLIED, SCREENING, INTERVIEW],
    savedDaysAgo: 14,
    stepDays: 3,
  },
  {
    title: 'React Developer (Telegram channel post)',
    source: 'TELEGRAM',
    workFormat: 'REMOTE',
    salaryFrom: 190000,
    path: [SAVED, APPLIED],
    savedDaysAgo: 10,
    stepDays: 2,
  },
  {
    title: 'Frontend Developer, fintech',
    url: 'https://hh.ru/vacancy/1008',
    source: 'HH',
    workFormat: 'HYBRID',
    salaryFrom: 230000,
    salaryTo: 310000,
    path: [SAVED],
    savedDaysAgo: 3,
    stepDays: 1,
  },
  {
    company: 'yandex',
    title: 'Frontend Developer, Maps',
    url: 'https://hh.ru/vacancy/1009',
    source: 'HH',
    workFormat: 'OFFICE',
    salaryFrom: 260000,
    path: [SAVED],
    savedDaysAgo: 2,
    stepDays: 1,
  },
  {
    company: 'tinkoff',
    title: 'Frontend Developer, Investments',
    url: 'https://hh.ru/vacancy/1010',
    source: 'HH',
    workFormat: 'HYBRID',
    salaryFrom: 270000,
    salaryTo: 360000,
    path: [SAVED, APPLIED, SCREENING],
    savedDaysAgo: 18,
    stepDays: 5,
  },
  {
    company: 'ozon',
    title: 'Tech Lead, Seller Cabinet',
    url: 'https://linkedin.com/jobs/view/2011',
    source: 'LINKEDIN',
    workFormat: 'HYBRID',
    salaryFrom: 400000,
    salaryTo: 500000,
    path: [SAVED, ARCHIVED],
    savedDaysAgo: 30,
    stepDays: 8,
  },
  {
    title: 'Fullstack Developer (Next.js + Node)',
    url: 'https://t.me/jobs_frontend/777',
    source: 'TELEGRAM',
    workFormat: 'REMOTE',
    salaryFrom: 210000,
    salaryTo: 290000,
    path: [SAVED, APPLIED, REJECTED],
    savedDaysAgo: 25,
    stepDays: 3,
  },
  {
    company: 'jetbrains',
    title: 'Frontend Developer, Kotlin Docs',
    url: 'https://linkedin.com/jobs/view/2013',
    source: 'LINKEDIN',
    workFormat: 'REMOTE',
    salaryFrom: 330000,
    salaryTo: 440000,
    path: [SAVED, APPLIED, SCREENING, INTERVIEW, REJECTED],
    savedDaysAgo: 50,
    stepDays: 6,
  },
  {
    company: 'skyeng',
    title: 'Frontend Developer, Teacher Tools',
    source: 'OTHER',
    workFormat: 'OFFICE',
    salaryFrom: 190000,
    path: [SAVED, ARCHIVED],
    savedDaysAgo: 33,
    stepDays: 10,
  },
  {
    company: 'startup',
    title: 'UI Engineer',
    source: 'REFERRAL',
    workFormat: 'REMOTE',
    salaryFrom: 170000,
    salaryTo: 240000,
    path: [SAVED, APPLIED, SCREENING, INTERVIEW, OFFER],
    savedDaysAgo: 38,
    stepDays: 4,
  },
  {
    title: 'Frontend Developer, e-commerce',
    url: 'https://hh.ru/vacancy/1016',
    source: 'HH',
    workFormat: 'REMOTE',
    salaryFrom: 200000,
    salaryTo: 270000,
    path: [SAVED, APPLIED, SCREENING],
    savedDaysAgo: 12,
    stepDays: 3,
  },
];

const addDays = (date: Date, days: number) => new Date(date.getTime() + days * DAY_MS);

// Creates companies, vacancies, status history and cover letters for one user.
// A small structural type: the real Prisma client and a test fake both satisfy it.
export type DemoDataClient = {
  company: {
    create: (args: { data: Prisma.CompanyUncheckedCreateInput }) => PromiseLike<{ id: string }>;
  };
  vacancy: {
    create: (args: { data: Prisma.VacancyUncheckedCreateInput }) => PromiseLike<unknown>;
  };
};

export const createDemoData = async (client: DemoDataClient, userId: string, now = new Date()) => {
  const companyIds = new Map<string, string>();
  for (const company of companies) {
    const created = await client.company.create({
      data: { userId, name: company.name, website: company.website, notes: company.notes },
    });
    companyIds.set(company.key, created.id);
  }

  for (const item of vacancies) {
    const savedAt = addDays(now, -item.savedDaysAgo);
    const changes = item.path.map((toStatus, index) => ({
      fromStatus: index === 0 ? null : (item.path[index - 1] ?? null),
      toStatus,
      changedAt: addDays(savedAt, index * item.stepDays),
    }));
    const appliedChange = changes.find((change) => change.toStatus === APPLIED);
    const currentStatus = item.path[item.path.length - 1] ?? SAVED;
    const lastChange = changes[changes.length - 1];

    await client.vacancy.create({
      data: {
        userId,
        companyId: item.company ? companyIds.get(item.company) : undefined,
        title: item.title,
        url: item.url,
        source: item.source,
        workFormat: item.workFormat,
        salaryFrom: item.salaryFrom,
        salaryTo: item.salaryTo,
        description: item.description,
        status: currentStatus,
        appliedAt: appliedChange?.changedAt,
        createdAt: savedAt,
        updatedAt: lastChange?.changedAt ?? savedAt,
        statusChanges: { create: changes },
        coverLetters: item.coverLetter
          ? { create: { content: item.coverLetter, createdAt: addDays(savedAt, 1) } }
          : undefined,
      },
    });
  }
};
