import { urlParse } from "url_parse";
import * as queryString from "querystring";
import { IListFirstLoadParams, IListLoadParams } from "../types.ts";

export function getListLoadParams(rawUrl: string): IListLoadParams {
  const url = urlParse(rawUrl);
  const queryParams = queryString.parse(url.search);

  const offset = Number(queryParams.offset);
  const limit = Number(queryParams.limit);

  return { offset, limit };
}

export function getFirstLoadListParams(rawUrl: string): IListLoadParams {
  const url = urlParse(rawUrl);
  const queryParams = queryString.parse(
    url.search,
  ) as unknown as IListFirstLoadParams;

  let quantity = Number(queryParams.quantity);

  if (!quantity) {
    quantity = 5;
  }

  return { offset: 0, limit: quantity, tags: queryParams.tags };
}
