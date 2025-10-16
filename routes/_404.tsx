import { define } from "../fresh.ts";

export default define.page((ctx) => {
  const { url } = ctx;
  return (
    <div class="self-center text-center p-8 max-w-screen-lg">
      <h1 class="text-4xl font-bold mb-6">404 - Page Not Found</h1>
      <p class="text-lg mb-6">
        The page{" "}
        <code class="bg-[#3c3836] text-[#ebdbb2] px-2 py-1 rounded">
          {url.pathname}
        </code>{" "}
        could not be found.
      </p>
      <p>
        <a href="/" class="wavy-link">Return to homepage</a>
      </p>
    </div>
  );
});
