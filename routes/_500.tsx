import { define } from "../fresh.ts";

export default define.page((ctx) => {
  const { error } = ctx;
  return (
    <div class="px-4 sm:px-8 py-8 mx-auto max-w-screen-lg">
      <h1 class="text-4xl font-bold mb-4">500 - Internal Server Error</h1>
      <p class="text-lg mb-4">
        Something went wrong on our end. We apologize for the inconvenience.
      </p>
      {error && (
        <details class="mb-4">
          <summary class="cursor-pointer text-blue-600 hover:underline">
            Technical Details
          </summary>
          <pre class="bg-gray-100 p-4 rounded mt-2 overflow-x-auto">
            {(error as Error).message}
          </pre>
        </details>
      )}
      <p class="mb-4">
        Please try refreshing the page or go back to the{" "}
        <a href="/" class="text-blue-600 hover:underline">homepage</a>.
      </p>
    </div>
  );
});
