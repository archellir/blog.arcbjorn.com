import { FunctionalComponent } from "preact";

import type { IPostSummary } from "../types.ts";
import { isoDate } from "../utils/dates.ts";
import { tagHref } from "../utils/tags.ts";

interface PostRowProps {
  post: IPostSummary;
}

// One post in the list. The title is the link and the whole row its hit
// area (see posts.css); date and tags sit beside it as their own elements,
// so the tags can be links of their own.
const PostRow: FunctionalComponent<PostRowProps> = ({ post }) => {
  const date = isoDate(post.publishedAt);

  return (
    <li class="postRow">
      <h3 class="postTitle">
        <a class="postLink" href={`/${post.id}`}>
          {post.title}
          {post.leetcode_number
            ? <span class="postNumber">#{post.leetcode_number}</span>
            : null}
        </a>
      </h3>
      <time class="postDate" dateTime={date}>{date}</time>
      {post.snippet && <p class="postSnippet">{post.snippet}</p>}
      {post.tags && post.tags.length > 0 && (
        <ul class="postTags" aria-label="Tags">
          {post.tags.map((tag) => (
            <li key={tag}>
              <a class="postTag" href={tagHref(tag)}>{tag}</a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default PostRow;
