import { FunctionalComponent } from "preact";
import { useState } from "preact/hooks";

import Post from "../components/Post.tsx";

import { pullPosts } from "../api/pullPosts.ts";
import { IHomePageData, IPost } from "../types.ts";

type IPostsListPageData = Pick<IHomePageData, "posts" | "locales">;

const PostsList: FunctionalComponent<IPostsListPageData> = (props) => {
  const [posts, setPosts] = useState<IPost[]>(props.posts);
  const [showMoreButton, setShowMoreButton] = useState<boolean>(true);

  const loadMorePosts = async () => {
    const baseOrigin = window.location.origin;
    const postsData = await pullPosts(baseOrigin, posts);

    const queryParams = `?quantity=${postsData.posts.length}`;
    const refreshUrl = baseOrigin + queryParams;
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
        {showMoreButton && <button onClick={loadMorePosts}>More posts</button>}
      </div>
    </>
  );
};

export default PostsList;
