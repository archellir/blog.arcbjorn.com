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

const Separator = () => <span class="metaDot" aria-hidden="true">·</span>;

// The head of a post: title, then one line with the date, the reading time
// and the tags, the snippet, and a folded list of the article's sections
// when there are a few.
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
      <Separator />
      <span>{minutes} min read</span>
      {post.tags && post.tags.length > 0 && (
        <>
          <Separator />
          <span class="srOnly">Tagged</span>
          {post.tags.map((tag, index) => (
            <>
              {index > 0 && <Separator />}
              <a key={tag} class="tag" href={tagHref(tag)}>
                <span aria-hidden="true">#</span>
                {tag}
              </a>
            </>
          ))}
        </>
      )}
    </p>

    {post.snippet && <p class="standfirst">{post.snippet}</p>}

    {headings.length >= TOC_MIN_HEADINGS && (
      <details class="toc" f-client-nav={false}>
        <summary class="tocLabel">Contents</summary>
        <ol class="tocList">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a class="tocLink" href={`#${heading.id}`}>{heading.text}</a>
            </li>
          ))}
        </ol>
      </details>
    )}
  </header>
);

export default PostHeader;
