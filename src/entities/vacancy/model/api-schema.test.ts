import { describe, expect, it } from 'vitest';

import { vacancyApiSchema } from './api-schema';

const body = { title: 'Dev', source: 'LINKEDIN', workFormat: 'HYBRID' };

describe('vacancyApiSchema', () => {
  it('accepts numbers and null from JSON and applies the form rules', () => {
    const result = vacancyApiSchema.parse({
      ...body,
      title: ' Dev ',
      companyName: null,
      salaryFrom: 200000,
      salaryTo: null,
    });

    expect(result).toMatchObject({ title: 'Dev', salaryFrom: 200000, source: 'LINKEDIN' });
    expect(result.companyName).toBeUndefined();
    expect(result.salaryTo).toBeUndefined();
  });

  it('ignores unknown keys such as userId', () => {
    const result = vacancyApiSchema.parse({ ...body, userId: 'someone-else' });

    expect(result).not.toHaveProperty('userId');
  });

  it('reuses the form rules for the salary range and the url', () => {
    const result = vacancyApiSchema.safeParse({
      ...body,
      url: 'javascript:alert(1)',
      salaryFrom: 500,
      salaryTo: 100,
    });

    expect(result.success).toBe(false);
    const paths = result.success ? [] : result.error.issues.map((issue) => issue.path[0]);
    expect(paths).toEqual(expect.arrayContaining(['url', 'salaryTo']));
  });

  it('rejects a non-integer salary and a non-object body', () => {
    expect(vacancyApiSchema.safeParse({ ...body, salaryFrom: 1.5 }).success).toBe(false);
    expect(vacancyApiSchema.safeParse([1]).success).toBe(false);
    expect(vacancyApiSchema.safeParse(null).success).toBe(false);
  });
});
