import type { WeekBucket } from '../model/stats';

const weekLabel = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
});

const formatWeek = (weekStart: string) => weekLabel.format(new Date(`${weekStart}T00:00:00Z`));

export const WeeklyChart = ({ weeks }: { weeks: WeekBucket[] }) => {
  const max = Math.max(1, ...weeks.map((week) => week.count));

  return (
    <figure className="flex flex-col gap-2">
      <div className="flex h-40 items-end gap-1" aria-hidden="true">
        {weeks.map((week, index) => (
          <div
            key={week.weekStart}
            className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1"
          >
            <span className="text-xs text-slate-600">{week.count}</span>
            <div
              className="w-full rounded-t bg-blue-600"
              style={{ height: `${(week.count / max) * 100}%`, minHeight: week.count ? 4 : 0 }}
            />
            <span
              className={`text-[10px] text-slate-500 ${index % 2 === 0 ? '' : 'hidden sm:block'}`}
            >
              {formatWeek(week.weekStart)}
            </span>
          </div>
        ))}
      </div>
      <table className="sr-only">
        <caption>Applications per week</caption>
        <thead>
          <tr>
            <th scope="col">Week starting</th>
            <th scope="col">Applications</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week.weekStart}>
              <th scope="row">{formatWeek(week.weekStart)}</th>
              <td>{week.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
};
