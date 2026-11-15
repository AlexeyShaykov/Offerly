import { PrismaClient } from '@prisma/client';

import { createDemoData } from '../src/shared/lib/demo-data';

const prisma = new PrismaClient();

const DEMO_EMAIL = 'demo@offerly.dev';

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
  await createDemoData(prisma, user.id);
};

main()
  .then(() => prisma.$disconnect())
  .catch(async (error: unknown) => {
    process.stderr.write(`Seed failed: ${String(error)}\n`);
    await prisma.$disconnect();
    process.exit(1);
  });
