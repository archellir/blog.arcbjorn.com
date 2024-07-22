import { FunctionalComponent } from "preact";
import { Handlers, PageProps, FreshContext } from "$fresh/server.ts";

import HeadElement from "../components/HeadElement.tsx";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import Introduction from "../components/Introduction.tsx";
import PostsList from "../islands/PostsList.tsx";

import { IHomePageData, IPostsResponse, IState } from "../types.ts";
import { listPosts } from "../api/listPosts.ts";

import { getFirstLoadListParams } from "../utils/getListParams.ts";

export const handler: Handlers<IHomePageData, IState> = {
  async GET(req, ctx: FreshContext<IState>) {
    const listParams = getFirstLoadListParams(req.url);
    const postsData: IPostsResponse = await listPosts(listParams);

    return ctx.render({ ...ctx.state, postsData });
  },
};

const Home: FunctionalComponent<PageProps<IHomePageData>> = (props) => {
  const { data, url } = props;
  return (
    <>
      <HeadElement
        url={url}
        title="Thoughtbook"
        image={url.href + "logo.svg"}
        description="Tech explorations"
      />

      <div class="flex flex-col h-full">
        <Header />

        <Introduction />

        <PostsList postsData={data.postsData} locales={data.locales} />

        <Footer classes="mt-auto" />
      </div>
    </>
  );
};

export default Home;
