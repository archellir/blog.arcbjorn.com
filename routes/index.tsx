import { FunctionalComponent } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";

import { IPost, IState } from "../types.ts";
import { listPosts } from "../api/listPosts.ts";

import { HeadElement } from "../components/HeadElement.tsx";
import { Header } from "../components/Header.tsx";
import { Post } from "../components/Post.tsx";
import { Footer } from "../components/Footer.tsx";

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

        <div class="self-center text-center p-8 max-w-screen-lg text-sm sm:text-base lg:border-x border-t border-dashed border-gray-400">
          <div class="p-1">
            My first name is Oleg{" "}
            <span class="text-green-600">[al'eg].{" "}</span>
            <a
              target="_blank"
              href="https://arcbjorn.com"
              class="underline"
            >
              More info.
            </a>
          </div>
          <div class="p-1">
            Here I share my explorations of System Design, Algorithms, Math,
            Networks, Databases, Operational Systems, Blockchain, programming
            languages & patterns, web related tech.
          </div>
        </div>

        <div class="max-w-screen-lg self-center flex-grow">
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
