export enum ETag {
  LINUX = "linux",
  LEETCODE = "leetcode",
  ADVENT_OF_CODE = "advent",
}

export interface IPost {
  id: string;
  title: string;
  publishedAt: string;
  snippet: string;
  tags?: ETag[];
  content: string;
}

export type TMarkdownMetadata = Omit<IPost, "content" | "publishedAt"> & {
  published_at: string;
};

export interface IState {
  locales: string[];
}

export interface IHomePageData extends IState {
  posts: IPost[];
}

interface IListParams {
  tags?: ETag[];
}

export interface IPostsResponse {
  posts: IPost[];
  all: number;
}

export interface IListFirstLoadParams extends IListParams {
  quantity: number;
}

export interface IListLoadParams extends IListParams {
  limit: number;
  offset: number;
}
