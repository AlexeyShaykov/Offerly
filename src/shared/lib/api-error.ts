import { NextResponse } from 'next/server';

export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'INVALID_JSON'
  | 'UNSUPPORTED_MEDIA_TYPE'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR';

type ApiErrorDetails = { fieldErrors?: Partial<Record<string, string[]>> };

// Single error shape for every route handler: { error: { code, message, details? } }.
export const apiError = (
  status: number,
  code: ApiErrorCode,
  message: string,
  details?: ApiErrorDetails,
) => NextResponse.json({ error: { code, message, ...(details && { details }) } }, { status });
