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
  image?: string;
  leetcode_number?: number;
}

export type TMarkdownMetadata = Omit<IPost, "content" | "publishedAt"> & {
  published_at: string;
  image?: string;
};

export interface IState {
  locales: string[];
}

export interface IPostsResponse {
  posts: IPost[];
  all: number;
}

export interface IListLoadParams {
  limit: number;
  offset: number;
  tags?: string;
}

export interface IQueryParams {
  offset?: string;
  limit?: string;
  quantity?: string;
  tags?: string;
}
