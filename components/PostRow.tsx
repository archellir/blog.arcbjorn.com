import { FunctionalComponent } from "preact";

import type { IPostSummary } from "../types.ts";
import { isoDate } from "../utils/dates.ts";
import { tagHref } from "../utils/tags.ts";

interface PostRowProps {
  post: IPostSummary;
}

// One post in the list: title and date on a line, the snippet beneath, tags
// (each a filter) under that. Tags sit outside the main link so they can be
// links of their own.
const PostRow: FunctionalComponent<PostRowProps> = ({ post }) => {
  const date = isoDate(post.publishedAt);

  return (
    <li class="postRow">
      <a class="postLink" href={`/${post.id}`}>
        <div class="postHead">
          <h3 class="postTitle">
            {post.title}
            {post.leetcode_number
              ? <span class="postNumber">#{post.leetcode_number}</span>
              : null}
          </h3>
          <time class="postDate" dateTime={date}>{date}</time>
        </div>
        {post.snippet && <p class="postSnippet">{post.snippet}</p>}
      </a>
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
