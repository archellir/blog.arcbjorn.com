import { IListLoadParams, IQueryParams } from "../types.ts";
import { POSTS_SET_NUMBER } from "../constants.ts";
import parseQueryParams from "./parseQueryParams.ts";

function getQueryParams(rawUrl: string): IQueryParams {
  const url = new URL(rawUrl);
  return parseQueryParams(url.search);
}

export function getListLoadParams(rawUrl: string): IListLoadParams {
  const queryParams = getQueryParams(rawUrl);

  const rawOffset = Number(queryParams.offset);
  const rawLimit = Number(queryParams.limit);

  const offset = Number.isFinite(rawOffset) && rawOffset > 0 ? rawOffset : 0;
  const limit = Number.isFinite(rawLimit) && rawLimit > 0
    ? rawLimit
    : POSTS_SET_NUMBER;

  return { offset, limit, tags: queryParams.tags };
}

export function getFirstLoadListParams(rawUrl: string): IListLoadParams {
  const queryParams = getQueryParams(rawUrl);

  const rawQuantity = Number(queryParams.quantity);
  const quantity = Number.isFinite(rawQuantity) && rawQuantity > 0
    ? rawQuantity
    : POSTS_SET_NUMBER;

  return { offset: 0, limit: quantity, tags: queryParams.tags };
}
