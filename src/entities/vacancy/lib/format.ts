const numberFormat = new Intl.NumberFormat('ru-RU');
const dateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'UTC' });

export const formatDate = (date: Date) => dateFormat.format(date);

export const formatSalary = (from: number | null, to: number | null): string | null => {
  if (from !== null && to !== null) {
    return `${numberFormat.format(from)} – ${numberFormat.format(to)} ₽`;
  }
  if (from !== null) return `from ${numberFormat.format(from)} ₽`;
  if (to !== null) return `up to ${numberFormat.format(to)} ₽`;
  return null;
};
