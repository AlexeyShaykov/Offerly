// Server-only public API of the slice. Kept apart from index.ts so that client
// components can import the slice's UI and types without pulling in Prisma.
export { changeVacancyStatus, type ChangeStatusResult } from './api/change-status';
export { getVacancies } from './api/get-vacancies';
export { getVacancyStats, revalidateVacancyStats } from './api/get-stats';
export { getVacancyById } from './api/get-vacancy-by-id';
export { createVacancy, updateVacancy } from './api/save-vacancy';
