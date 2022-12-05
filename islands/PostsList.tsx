import { FunctionalComponent } from "preact";
import { useState } from "preact/hooks";

import Post from "../components/Post.tsx";

import { pullPosts } from "../api/pullPosts.ts";
import { IPost, IPostsResponse, IState } from "../types.ts";
import parseQueryParams from "../utils/parseQueryParams.ts";

type IPostsListPageData = IState & {
  postsData: IPostsResponse;
};

const PostsList: FunctionalComponent<IPostsListPageData> = (props) => {
  const [posts, setPosts] = useState<IPost[]>(props.postsData.posts);

  const all = props.postsData.posts.length === props.postsData.all;

  const [showMoreButton, setShowMoreButton] = useState<boolean>(!all);

  const loadMorePosts = async () => {
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

    setPosts([...postsData.posts]);

    const all = postsData.posts.length === postsData.all;
    setShowMoreButton(!all);
  };

  return (
    <>
      <div class="max-w-screen-lg self-center flex-grow pt-8 sm:pt-16">
        <ul>
          {posts.map((post) => <Post post={post} locales={props.locales} />)}
        </ul>
      </div>
      {showMoreButton &&
        (
          <button class="mx-auto underline" onClick={loadMorePosts}>
            More posts
          </button>
        )}
    </>
  );
};

export default PostsList;
