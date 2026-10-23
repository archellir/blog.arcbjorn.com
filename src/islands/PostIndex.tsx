import { useState } from 'preact/hooks';

import PostRow from './PostRow';
import { PlusIcon } from '../components/Icons';
import { groupByYear } from '../lib/groupPosts';
import type { IPostSummary } from '../lib/types';

interface PostIndexProps {
  posts: IPostSummary[];
  pageSize: number;
}

// The post index: every post is in the page, grouped by year, with the ones
// past the first page hidden until "More posts" reveals the next batch.
export default function PostIndex({ posts, pageSize }: PostIndexProps) {
  const [shown, setShown] = useState(pageSize);
  const remaining = Math.max(0, posts.length - shown);
  const groups = groupByYear(posts.map((post, index) => ({ ...post, index })));
  const lastVisibleGroup = groups.findLast(group => group.posts[0].index < shown);

  return (
    <>
      {groups.map(group => {
        const visible = group.posts.some(post => post.index < shown);
        return (
          <section
            key={group.year}
            class={visible ? 'yearGroup' : 'yearGroup rowHidden'}
            aria-labelledby={`year-${group.year}`}
          >
            <h2 id={`year-${group.year}`} class="year">
              {group.year}
            </h2>
            <ul class="rows">
              {group.posts.map(post => (
                <PostRow key={post.id} post={post} hidden={post.index >= shown} />
              ))}
            </ul>
            {group === lastVisibleGroup && remaining > 0 && (
              <button type="button" class="moreButton" onClick={() => setShown(shown + pageSize)}>
                <span class="moreLabel">
                  More posts
                  <span class="totalCount">{remaining}</span>
                </span>
                <PlusIcon />
              </button>
            )}
          </section>
        );
      })}
    </>
  );
}
