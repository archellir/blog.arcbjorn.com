import { FunctionalComponent } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

import Post from "../components/Post.tsx";
import Loader from "../components/Loader.tsx";

import { pullPosts } from "../api/pullPosts.ts";
import { IPost, IPostsResponse, IState } from "../types.ts";
import parseQueryParams from "../utils/parseQueryParams.ts";
import useOnScreen from "../utils/useOnScreen.tsx";

type IPostsListPageData = IState & {
  postsData: IPostsResponse;
};

const PostsList: FunctionalComponent<IPostsListPageData> = (props) => {
  const [posts, setPosts] = useState<IPost[]>(props.postsData.posts);
  const loadingTimeoutRef = useRef<number | null>(null);

  const all = props.postsData.posts.length === props.postsData.all;
  const [hasMore, setHasMore] = useState<boolean>(!all);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { measureRef, isIntersecting, observer } = useOnScreen();
  const [isMobile, setIsMobile] = useState<boolean>(
    globalThis.innerWidth <= 576,
  );

  const loadMorePosts = useCallback(async () => {
    setIsLoading(true);

    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    const baseOrigin = globalThis.location.origin;
    const queryParams = parseQueryParams(globalThis.location.search);

    let queryParamsString = "?";
    if (queryParams.tags) {
      queryParamsString = `?tags=${queryParams.tags}&`;
    }

    const postsData = await pullPosts(baseOrigin, [...posts], queryParams.tags);

    loadingTimeoutRef.current = setTimeout(() => {
      queryParamsString += `quantity=${postsData.posts.length}`;
      const refreshUrl = baseOrigin + queryParamsString;
      globalThis.history.pushState({ path: refreshUrl }, "", refreshUrl);

      const hasMore = postsData.posts.length !== postsData.all;

      setPosts(postsData.posts);
      setHasMore(hasMore);
      setIsLoading(false);
      setIsMobile(globalThis.innerWidth <= 576);
    }, 750);
  }, [posts]);

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    if (isIntersecting && hasMore) {
      loadMorePosts();
      if (observer) {
        observer.disconnect();
      }
    }
  }, [isIntersecting, hasMore, loadMorePosts]);

  return (
    <>
      <div class="flex flex-col max-w-screen-lg self-center flex-grow pt-8 sm:pt-16">
        <ul class="grid grid-cols-1 lg:grid-cols-2 lg:gap-4">
          {posts.map((post, index) => {
            if (index === posts.length - 1) {
              return (
                <Post
                  key={post.id}
                  measureRef={measureRef}
                  post={post}
                  locales={props.locales}
                />
              );
            }
            return <Post key={post.id} post={post} locales={props.locales} />;
          })}
        </ul>
        {isLoading ? <Loader /> : hasMore
          ? (
            <button
              role="button"
              type="button"
              class="mx-auto my-8"
              onClick={loadMorePosts}
            >
              <span class="button_top prevent-select">
                More posts
              </span>
            </button>
          )
          : null}
      </div>
    </>
  );
};

export default PostsList;