import { FunctionalComponent } from "preact";

import type { IHeading, IPostSummary } from "../types.ts";
import { SITE_NAME } from "../constants.ts";
import { isoDate } from "../utils/dates.ts";
import { tagHref } from "../utils/tags.ts";

interface PostIntroProps {
  post: IPostSummary;
  date: string;
  minutes: number;
  headings: IHeading[];
}

// Show a table of contents only when there is enough to navigate.
const TOC_MIN_HEADINGS = 3;

// Left-pane letter for a post: title, when and how long, tags, the snippet,
// and on wide screens the sections of the article.
const PostIntro: FunctionalComponent<PostIntroProps> = (
  { post, date, minutes, headings },
) => (
  <div class="letter">
    <p class="eyebrow">
      <a href="/">{SITE_NAME}</a>
    </p>
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
            <a class="tag" href={tagHref(tag)}>{tag}</a>
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
  </div>
);

export default PostIntro;
