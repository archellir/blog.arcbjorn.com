import { IPost, IState } from "../types.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { listPosts } from "../api/listPosts.ts";
import Header from "../components/Header.tsx";
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
    <li class="border-t py-4 px-2 mx-8">
      <a
        href={`/${post.id}`}
        class="p-2 flex justify-start items-baseline flex-wrap md:flex-nowrap gap-y-2 gap-x-4 group"
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
        description="Thoughtbook of Arcbjorn"
        image={url.href + "logo.svg"}
        title="Arc's thoughtbook"
        url={url}
      />

      <div class="flex flex-col">
        <Header />
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
