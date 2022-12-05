import { IQueryParams } from "../types.ts";

export default function parseQueryParams(urlSearch: string): IQueryParams {
  const queryParams = new Proxy(new URLSearchParams(urlSearch), {
    get: (searchParams, prop: string) => searchParams.get(prop),
  });

  return queryParams as IQueryParams;
}
