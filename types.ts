export interface IPost {
  id: string;
  title: string;
  publishedAt: Date;
  snippet: string;
  content: string;
}

export interface IState {
  locales: string[];
}
