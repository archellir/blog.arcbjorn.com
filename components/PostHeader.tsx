import { FunctionalComponent } from "preact";

import type { IHeading, IPostSummary } from "../types.ts";
import { isoDate } from "../utils/dates.ts";
import { tagHref } from "../utils/tags.ts";

interface PostHeaderProps {
  post: IPostSummary;
  date: string;
  minutes: number;
  headings: IHeading[];
}

// Show a table of contents only when there is enough to navigate.
const TOC_MIN_HEADINGS = 3;

// The head of a post: title, when and how long, tags, the snippet, and the
// sections of the article when there are a few.
const PostHeader: FunctionalComponent<PostHeaderProps> = (
  { post, date, minutes, headings },
) => (
  <header class="intro">
    <h1 class="title pageTitle">
      {post.title}
      {post.leetcode_number
        ? <span class="titleNumber">{` #${post.leetcode_number}`}</span>
        : null}
    </h1>
    <p class="meta">
      <time dateTime={isoDate(post.publishedAt)}>{date}</time>
      <span aria-hidden="true">·</span>
      <span>{minutes} min read</span>
    </p>

    {post.tags && post.tags.length > 0 && (
      <ul class="tags" aria-label="Tags">
        {post.tags.map((tag) => (
          <li key={tag}>
            <a class="tag" href={tagHref(tag)}>
              <span class="srOnly">Posts tagged</span>
              {tag}
            </a>
          </li>
        ))}
      </ul>
    )}

    {post.snippet && <p class="standfirst">{post.snippet}</p>}

    {headings.length >= TOC_MIN_HEADINGS && (
      <nav class="toc" aria-label="Contents" f-client-nav={false}>
        <p class="tocLabel">Contents</p>
        <ol class="tocList">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a class="tocLink" href={`#${heading.id}`}>{heading.text}</a>
            </li>
          ))}
        </ol>
      </nav>
    )}
  </header>
);

export default PostHeader;
