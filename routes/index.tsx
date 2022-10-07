import { IPost, IState } from "../types.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { listPosts } from "../api/listPosts.ts";
import { HeadElement } from "../components/HeadElement.tsx";

interface IData extends IState {
  posts: IPost[];
}

export const handler: Handlers<IData, IState> = {
  async GET(_req, ctx) {
    const posts = await listPosts();
    return ctx.render({ ...ctx.state, posts });
  },
};

function Post(props: { post: IPost; locales: IState["locales"] }) {
  const post = props.post;
  const dateFmt = new Intl.DateTimeFormat("en-UK", { dateStyle: "short" });

  return (
    <li class="border-t py-4 px-2 mx-8 list-none">
      <a
        href={`/${post.id}`}
        class="p-2 flex flex-col sm:flex-row justify-start items-baseline gap-y-2 gap-x-4 group"
      >
        <div class="font-plex-mono">{dateFmt.format(post.publishedAt)}</div>
        <div>
          <h2 class="text-xl tracking-tight font-plex-mono font-semibold group-hover:underline">
            {post.title}
          </h2>
          <p class="pt-1 font-plex-sans text-grey-600">{post.snippet}</p>
        </div>
      </a>
    </li>
  );
}

export default function Home(props: PageProps<IData>) {
  const { data, url } = props;
  return (
    <>
      <HeadElement
        url={url}
        title="Thoughtbook"
        image={url.href + "logo.svg"}
        description="Tech explorations"
      />

      <div class="flex flex-col">
        <div class="self-center text-center p-8 max-w-screen-md text-sm sm:text-base">
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

        <div class="max-w-screen-md self-center">
          <ul>
            {data.posts.map((post) => (
              <Post post={post} locales={data.locales} />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
