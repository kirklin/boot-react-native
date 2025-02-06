import type {
  GetNextPageParamFunction,
  GetPreviousPageParamFunction,
} from "@tanstack/react-query";

import type { PaginateQuery } from "../types";

interface KeyParams {
  [key: string]: any;
}
export const DEFAULT_LIMIT = 10;

export function getQueryKey<T extends KeyParams>(key: string, params?: T) {
  return [key, ...(params ? [params] : [])];
}

// for infinite query pages  to flatList data
export function normalizePages<T>(pages?: PaginateQuery<T>[]): T[] {
  return pages
    ? pages.reduce((prev: T[], current) => [...prev, ...current.results], [])
    : [];
}

// a function that accept a url and return params as an object
export function getUrlParameters(
  url: string | null,
): { [k: string]: string } | null {
  if (url === null) {
    return null;
  }
  const regex = /[?&]([^=#]+)=([^&#]*)/g;
  const params = {};
  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(url))) {
    if (match[1] !== null) {
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      params[match[1]] = match[2];
    }
  }
  return params;
}

export const getPreviousPageParam: GetNextPageParamFunction<
  unknown,
  PaginateQuery<unknown>
> = page => getUrlParameters(page.previous)?.offset ?? null;

export const getNextPageParam: GetPreviousPageParamFunction<
  unknown,
  PaginateQuery<unknown>
> = page => getUrlParameters(page.next)?.offset ?? null;
