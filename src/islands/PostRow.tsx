import type { IPostSummary } from '../lib/types';
import { isoDate, shortDate } from '../lib/dates';

interface PostRowProps {
  post: IPostSummary;
  // Day and month under a year heading; the full date anywhere else.
  fullDate?: boolean;
  hidden?: boolean;
}

// One post in a list: the date in a column of its own, then the title and
// snippet. The title is the link and the whole row its hit area.
export default function PostRow({ post, fullDate, hidden }: PostRowProps) {
  return (
    <li class={hidden ? 'row rowHidden' : 'row'}>
      <time class="rowDate" dateTime={isoDate(post.publishedAt)}>
        {fullDate ? isoDate(post.publishedAt) : shortDate(post.publishedAt)}
      </time>
      <div class="rowBody">
        <h3 class="rowTitle">
          <a class="rowLink" href={`/${post.id}`}>
            {post.title}
            {post.leetcode_number ? <span class="rowNumber">#{post.leetcode_number}</span> : null}
          </a>
        </h3>
        {post.snippet && <p class="rowSnippet">{post.snippet}</p>}
      </div>
    </li>
  );
}
