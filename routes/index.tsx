import { define } from "../fresh.ts";

import HeadElement from "../components/HeadElement.tsx";
import Introduction from "../components/Introduction.tsx";
import PostsList from "../islands/PostsList.tsx";

import { IPostsResponse } from "../types.ts";
import { listPosts } from "../api/listPosts.ts";

import { getFirstLoadListParams } from "../utils/getListParams.ts";

export default define.page(async (ctx) => {
  const url = ctx.url;
  const listParams = getFirstLoadListParams(ctx.req.url);
  const postsData: IPostsResponse = await listPosts(listParams);
  const locales = ctx.state.locales;
  return (
    <>
      <HeadElement
        url={url}
        title="Thoughtbook"
        image={`${url.origin}/images/og-default.png`}
        description="Tech explorations"
      />

      <Introduction />

      <PostsList postsData={postsData} locales={locales} />
    </>
  );
});
