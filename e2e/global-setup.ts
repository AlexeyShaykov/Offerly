import { execSync } from 'node:child_process';

import { PrismaClient } from '@prisma/client';
import { request, type FullConfig } from '@playwright/test';

const TEST_DB_NAME = 'offerly_test';
export const E2E_EMAIL = 'e2e-user@test.local';

const testDatabaseUrl =
  process.env.E2E_DATABASE_URL ??
  `postgresql://offerly:offerly@localhost:5432/${TEST_DB_NAME}?schema=public`;

// Connects to the maintenance database to create the test database when it does not exist yet.
const ensureDatabase = async () => {
  const adminUrl = testDatabaseUrl.replace(`/${TEST_DB_NAME}`, '/postgres');
  const admin = new PrismaClient({ datasourceUrl: adminUrl });
  try {
    const rows = await admin.$queryRaw<{ exists: boolean }[]>`
      SELECT EXISTS (SELECT 1 FROM pg_database WHERE datname = ${TEST_DB_NAME}) AS "exists"`;
    if (!rows[0]?.exists) {
      await admin.$executeRawUnsafe(`CREATE DATABASE ${TEST_DB_NAME}`);
    }
  } finally {
    await admin.$disconnect();
  }
};

const migrateAndReset = async () => {
  execSync('node_modules/.bin/prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: testDatabaseUrl },
    stdio: 'ignore',
  });

  const db = new PrismaClient({ datasourceUrl: testDatabaseUrl });
  try {
    await db.$executeRawUnsafe(
      'TRUNCATE "User", "Account", "Session", "VerificationToken", "Company", "Vacancy", "StatusChange", "CoverLetter" CASCADE',
    );
  } finally {
    await db.$disconnect();
  }
};

// Signs in through the test-only Credentials provider and stores the session cookie for all tests.
const signIn = async (baseURL: string) => {
  const api = await request.newContext({ baseURL });
  const { csrfToken } = (await (await api.get('/api/auth/csrf')).json()) as { csrfToken: string };

  const response = await api.post('/api/auth/callback/e2e', {
    form: { csrfToken, email: E2E_EMAIL, json: 'true' },
  });
  if (!response.ok()) throw new Error(`E2E sign-in failed with status ${response.status()}`);

  await api.storageState({ path: 'e2e/.auth/user.json' });
  await api.dispose();
};

const globalSetup = async (config: FullConfig) => {
  await ensureDatabase();
  await migrateAndReset();
  await signIn(config.projects[0]?.use.baseURL ?? 'http://localhost:3200');
};

export default globalSetup;
