import { FunctionalComponent } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";

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

  const all = props.postsData.posts.length === props.postsData.all;
  const [hasMore, setHasMore] = useState<boolean>(!all);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { measureRef, isIntersecting, observer } = useOnScreen();

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 576);

  const loadMorePosts = useCallback(async () => {
    setIsLoading(true);

    const baseOrigin = window.location.origin;

    const queryParams = parseQueryParams(window.location.search);

    let queryParamsString = "?";
    if (queryParams.tags) {
      queryParamsString = `?tags=${queryParams.tags}&`;
    }

    const postsData = await pullPosts(baseOrigin, posts, queryParams.tags);

    queryParamsString += `quantity=${postsData.posts.length}`;

    const refreshUrl = baseOrigin + queryParamsString;
    window.history.pushState({ path: refreshUrl }, "", refreshUrl);

    const all = postsData.posts.length === postsData.all;

    setPosts([...postsData.posts]);
    setHasMore(!all);
    setIsLoading(false);

    setIsMobile(window.innerWidth <= 576);
  }, [window.location]);

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

  const showMoreButton = !isMobile && !isLoading && hasMore;

  return (
    <>
      <div class="flex flex-col max-w-screen-lg self-center flex-grow pt-8 sm:pt-16">
        <ul>
          {posts.map((post, index) => {
            if (index === posts.length - 1) {
              return (
                <Post
                  measureRef={measureRef}
                  post={post}
                  locales={props.locales}
                />
              );
            }
            return <Post post={post} locales={props.locales} />;
          })}
        </ul>
        {isLoading && <Loader />}
      </div>
      {showMoreButton &&
        (
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
        )}
    </>
  );
};

export default PostsList;
