import { Post } from "../types.ts";

const post: Post = {
  id: "string",
  title: "string",
  published_at: new Date(),
  content: "string",
};

export default function BlogPostPage() {
  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <p class="text-grey-600 mt-12">
        {post.published_at.toLocaleDateString()}
      </p>
      <h1 class="text-5xl mt-2 font-bold">{post.title}</h1>
      <div class="mt-12">{post.title}</div>
    </div>
  );
}
