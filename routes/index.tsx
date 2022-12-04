import { FunctionalComponent } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";

import { IPost, IState } from "../types.ts";
import { listPosts } from "../api/listPosts.ts";

import { HeadElement } from "../components/HeadElement.tsx";
import { Header } from "../components/Header.tsx";
import { Post } from "../components/Post.tsx";
import { Footer } from "../components/Footer.tsx";
import Introduction from "../components/Introduction.tsx";

interface IHomePageData extends IState {
  posts: IPost[];
}

export const handler: Handlers<IHomePageData, IState> = {
  async GET(_req, ctx) {
    const posts = await listPosts();
    return ctx.render({ ...ctx.state, posts });
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

        <div class="max-w-screen-lg self-center flex-grow pt-8 sm:pt-16">
          <ul>
            {data.posts.map((post) => (
              <Post post={post} locales={data.locales} />
            ))}
          </ul>
        </div>

        <Footer classes="mt-auto" />
      </div>
    </>
  );
};

export default Home;
