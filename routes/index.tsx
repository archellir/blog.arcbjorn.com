import { define } from "../fresh.ts";

import HeadElement from "../components/HeadElement.tsx";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
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

      <div class="flex flex-col h-full">
        <Header />

        <Introduction />

        <PostsList postsData={postsData} locales={locales} />

        <Footer classes="mt-auto" />
      </div>
    </>
  );
});
