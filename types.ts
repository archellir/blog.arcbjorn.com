export interface IPost {
  id: string;
  title: string;
  publishedAt: string;
  snippet?: string;
  tags?: string[];
  content: string;
  image?: string;
  leetcode_number?: number;
}

// What lists and feeds need: everything but the body.
export type IPostSummary = Omit<IPost, "content">;

export type TMarkdownMetadata =
  & Omit<IPost, "id" | "content" | "publishedAt">
  & {
    published_at: string;
  };

// Nothing travels on the request context yet.
export type IState = Record<string, never>;

export interface IPostsResponse {
  posts: IPostSummary[];
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

export interface IHeading {
  id: string;
  text: string;
}
