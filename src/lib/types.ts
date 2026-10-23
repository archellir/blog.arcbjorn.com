export interface IPostSummary {
  id: string;
  title: string;
  // ISO date, "YYYY-MM-DD".
  publishedAt: string;
  snippet?: string;
  tags?: string[];
  image?: string;
  leetcode_number?: number;
}

export interface IPost extends IPostSummary {
  // The Markdown body.
  content: string;
}

export interface IHeading {
  id: string;
  text: string;
}
