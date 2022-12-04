export enum ETag {
  LINUX = "linux",
  LEETCODE = "leetcode",
  ADVENT_OF_CODE = "advent",
}

export interface IPost {
  id: string;
  title: string;
  publishedAt: Date;
  snippet: string;
  tags: ETag[];
  content: string;
}

export type TMarkdownMetadata = Omit<IPost, "content" | "publishedAt"> & {
  published_at: string;
};

export interface IState {
  locales: string[];
}
