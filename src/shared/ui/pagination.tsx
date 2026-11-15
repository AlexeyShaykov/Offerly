import Link from 'next/link';

type PaginationProps = {
  page: number;
  totalPages: number;
  getHref: (page: number) => string;
};

const linkClass =
  'rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900';
const disabledClass = 'rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-400';

export const Pagination = ({ page, totalPages, getHref }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-3">
      {page > 1 ? (
        <Link href={getHref(page - 1)} className={linkClass} rel="prev">
          Previous
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClass}>
          Previous
        </span>
      )}
      <span className="text-sm text-slate-600">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={getHref(page + 1)} className={linkClass} rel="next">
          Next
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClass}>
          Next
        </span>
      )}
    </nav>
  );
};
