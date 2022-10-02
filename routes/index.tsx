import { IPost } from "../types.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { listPosts } from "../api/listPosts.ts";

export const handler: Handlers<IPost[]> = {
  async GET(_req, ctx) {
    const posts = await listPosts();
    return ctx.render(posts);
  },
};

function Post(props: { post: IPost }) {
  const post = props.post;

  return (
    <li class="border-t mt-8">
      <a href={`/blog/${post.id}`} class="p-2 flex gap-4 group">
        <div>{post.publishedAt.toLocaleDateString()}</div>
        <div>
          <h2 class="text-xl font-bold group-hover:underline">{post.title}</h2>
          <p class="text-grey-600">{post.snippet}</p>
        </div>
      </a>
    </li>
  );
}

export default function Home(props: PageProps<IPost[]>) {
  const posts = props.data;
  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <h1 class="text-5xl mt-12 font-bold">Arc's blog</h1>
      <ul>
        {posts.map((post) => <Post post={post} />)}
      </ul>
    </div>
  );
}
