import { PrismaClient, VacancySource, VacancyStatus, WorkFormat } from '@prisma/client';

const prisma = new PrismaClient();

const DEMO_EMAIL = 'demo@offerly.dev';
const DAY_MS = 24 * 60 * 60 * 1000;

type SeedCompany = { key: string; name: string; website?: string; notes?: string };

type SeedVacancy = {
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

const companies: SeedCompany[] = [
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

const vacancies: SeedVacancy[] = [
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

const resolveUser = async () => {
  const targetEmail = process.env.SEED_USER_EMAIL;

  if (!targetEmail) {
    await prisma.user.deleteMany({ where: { email: DEMO_EMAIL } });
    return prisma.user.create({ data: { email: DEMO_EMAIL, name: 'Demo User' } });
  }

  const existing = await prisma.user.findUnique({ where: { email: targetEmail } });
  if (!existing) {
    throw new Error(`User ${targetEmail} not found. Sign in once before seeding.`);
  }

  await prisma.vacancy.deleteMany({ where: { userId: existing.id } });
  await prisma.company.deleteMany({ where: { userId: existing.id } });
  return existing;
};

const main = async () => {
  const user = await resolveUser();

  const companyIds = new Map<string, string>();
  for (const company of companies) {
    const created = await prisma.company.create({
      data: {
        userId: user.id,
        name: company.name,
        website: company.website,
        notes: company.notes,
      },
    });
    companyIds.set(company.key, created.id);
  }

  const now = new Date();

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

    await prisma.vacancy.create({
      data: {
        userId: user.id,
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

main()
  .then(() => prisma.$disconnect())
  .catch(async (error: unknown) => {
    process.stderr.write(`Seed failed: ${String(error)}\n`);
    await prisma.$disconnect();
    process.exit(1);
  });
