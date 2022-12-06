import { urlParse } from "url_parse";
import * as queryString from "querystring";
import { IListLoadParams, IQueryParams } from "../types.ts";
import { POSTS_SET_NUMBER } from "../constants.ts";

function getQueryParams(rawUrl: string): IQueryParams {
  const url = urlParse(rawUrl);
  return queryString.parse(url.search) as unknown as IQueryParams;
}

export function getListLoadParams(rawUrl: string): IListLoadParams {
  const queryParams = getQueryParams(rawUrl);

  const offset = Number(queryParams.offset);
  const limit = Number(queryParams.limit);

  return { offset, limit, tags: queryParams.tags };
}

export function getFirstLoadListParams(rawUrl: string): IListLoadParams {
  const queryParams = getQueryParams(rawUrl);

  let quantity = Number(queryParams.quantity);

  if (!quantity) {
    quantity = POSTS_SET_NUMBER;
  }

  return { offset: 0, limit: quantity, tags: queryParams.tags };
}
