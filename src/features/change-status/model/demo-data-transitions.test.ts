import { describe, expect, it } from 'vitest';

import { vacancies } from '@/shared/lib/demo-data';

import { canTransition } from './transitions';

describe('demo data', () => {
  it('only contains status histories that the real transition rules allow', () => {
    for (const { title, path } of vacancies) {
      expect(path[0], title).toBe('SAVED');
      path.slice(1).forEach((to, index) => {
        const from = path[index];
        expect(from && canTransition(from, to), `${title}: ${from} → ${to}`).toBe(true);
      });
    }
  });
});
