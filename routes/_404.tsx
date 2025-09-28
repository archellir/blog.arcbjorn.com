import { define } from "../fresh.ts";

export default define.page((ctx) => {
  const { url } = ctx;
  return (
    <div class="px-4 sm:px-8 py-8 mx-auto max-w-screen-lg">
      <h1 class="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p class="text-lg mb-4">
        The page{" "}
        <code class="bg-gray-100 px-2 py-1 rounded">{url.pathname}</code>{" "}
        could not be found.
      </p>
      <p class="mb-4">
        You might want to check out the{" "}
        <a href="/" class="text-blue-600 hover:underline">homepage</a>{" "}
        or browse the{" "}
        <a href="/posts" class="text-blue-600 hover:underline">blog posts</a>.
      </p>
    </div>
  );
});
