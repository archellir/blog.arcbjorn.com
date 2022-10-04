import { IPost, IState } from "../types.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { listPosts } from "../api/listPosts.ts";

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
    <li class="border-t mt-8">
      <a href={`/${post.id}`} class="p-2 flex gap-4 group">
        <div>{dateFmt.format(post.publishedAt)}</div>
        <div>
          <h2 class="text-xl font-bold group-hover:underline">{post.title}</h2>
          <p class="text-grey-600">{post.snippet}</p>
        </div>
      </a>
    </li>
  );
}

export default function Home(props: PageProps<IData>) {
  const { posts, locales } = props.data;
  return (
    <div class="p-4 mx-auto max-w-screen-md font-plex-mono">
      <h1 class="text-5xl mt-12 font-bold">Arc's blog</h1>
      <ul>
        {posts.map((post) => <Post post={post} locales={locales} />)}
      </ul>
    </div>
  );
}
