import { FunctionalComponent } from "preact";
import { useCallback, useEffect, useRef } from "preact/hooks";
import { signal } from "@preact/signals";

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
  const posts = signal<IPost[]>(props.postsData.posts);
  const loadingTimeoutRef = useRef<number | null>(null);

  const all = props.postsData.posts.length === props.postsData.all;
  const hasMore = signal<boolean>(!all);
  const isLoading = signal<boolean>(false);

  const { measureRef, isIntersecting, observer } = useOnScreen();
  const isMobile = signal<boolean>(globalThis.innerWidth <= 576);

  const loadMorePosts = useCallback(async () => {
    isLoading.value = true;

    // Clear any existing timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    const baseOrigin = globalThis.location.origin;
    const queryParams = parseQueryParams(globalThis.location.search);

    let queryParamsString = "?";
    if (queryParams.tags) {
      queryParamsString = `?tags=${queryParams.tags}&`;
    }

    const postsData = await pullPosts(
      baseOrigin,
      posts.value,
      queryParams.tags,
    );

    // Set minimum loading time
    loadingTimeoutRef.current = setTimeout(() => {
      queryParamsString += `quantity=${postsData.posts.length}`;
      const refreshUrl = baseOrigin + queryParamsString;
      globalThis.history.pushState({ path: refreshUrl }, "", refreshUrl);

      const hasMorePosts = postsData.posts.length !== postsData.all;

      posts.value = [...postsData.posts];
      hasMore.value = hasMorePosts;
      isLoading.value = false;
      isMobile.value = globalThis.innerWidth <= 576;
    }, 750);
  }, [globalThis.location]);

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isMobile.value) {
      return;
    }

    if (isIntersecting && hasMore.value) {
      loadMorePosts();
      if (observer) {
        observer.disconnect();
      }
    }
  }, [isIntersecting, hasMore.value, loadMorePosts]);

  return (
    <>
      <div class="flex flex-col max-w-screen-lg self-center flex-grow pt-8 sm:pt-16">
        <ul class="grid grid-cols-1 lg:grid-cols-2 lg:gap-4">
          {posts.value.map((post, index) => {
            if (index === posts.value.length - 1) {
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
        {isLoading.value ? <Loader /> : hasMore.value
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
