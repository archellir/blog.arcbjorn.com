import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { IS_BROWSER } from "fresh/runtime";

import PostRow from "../components/PostRow.tsx";
import { PlusIcon } from "../components/Icons.tsx";
import { pullPosts } from "../api/pullPosts.ts";
import type { IPostSummary } from "../types.ts";

interface PostsListProps {
  posts: IPostSummary[];
  all: number;
  tags?: string;
}

// Keep the number of loaded posts in the URL so a reload shows the same list.
function rememberQuantity(quantity: number) {
  const url = new URL(globalThis.location.href);
  url.searchParams.set("quantity", String(quantity));
  globalThis.history.replaceState(globalThis.history.state, "", url);
}

export default function PostsList(
  { posts: initialPosts, all, tags }: PostsListProps,
) {
  const [posts, setPosts] = useState<IPostSummary[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const moreRef = useRef<HTMLButtonElement>(null);

  const remaining = Math.max(0, all - posts.length);

  const loadMore = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setFailed(false);
    try {
      const page = await pullPosts(posts.length, tags);
      const next = [...posts, ...page.posts];
      setPosts(next);
      rememberQuantity(next.length);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [loading, posts, tags]);

  // On narrow screens the next page loads as the control scrolls into view.
  useEffect(() => {
    const control = moreRef.current;
    if (!IS_BROWSER || !control || remaining === 0 || failed) return;
    if (!globalThis.matchMedia("(max-width: 39.99rem)").matches) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMore();
    }, { rootMargin: "240px" });
    observer.observe(control);
    return () => observer.disconnect();
  }, [remaining, failed, loadMore]);

  if (posts.length === 0) {
    return (
      <p class="emptyState">
        No posts carry these tags yet.{" "}
        <a class="inlineLink" href="/">See all posts</a>.
      </p>
    );
  }

  const label = failed
    ? "Could not load more, try again"
    : loading
    ? "Loading"
    : "More posts";

  return (
    <>
      <ul class="postRows">
        {posts.map((post) => <PostRow key={post.id} post={post} />)}
      </ul>
      {remaining > 0 && (
        <button
          ref={moreRef}
          type="button"
          class="moreButton"
          onClick={loadMore}
          disabled={loading}
          aria-busy={loading}
        >
          <span class="moreLabel">
            {label}
            <span class="totalCount">{remaining}</span>
          </span>
          <PlusIcon />
        </button>
      )}
    </>
  );
}
