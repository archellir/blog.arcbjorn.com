import { FunctionalComponent, Ref } from "preact";
import { memo } from "preact/compat";
import { IPost, IState } from "../types.ts";

interface IPostProps {
  post: IPost;
  locales: IState["locales"];
  measureRef?: Ref<HTMLLIElement>;
}

const Post: FunctionalComponent<IPostProps> = memo(({ post, measureRef }) => {
  const dateFmt = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "short",
  });

  const localizedDate = dateFmt.format(new Date(post.publishedAt));

  return (
    <li
      class="border-t border-gray-400 py-4 px-2 mx-8 list-none"
      ref={measureRef}
    >
      <a
        href={`/${post.id}`}
        class="p-2 flex flex-col sm:flex-row justify-start items-start gap-y-2 gap-x-4 group"
      >
        {/* Desktop: Date in separate column */}
        <div class="hidden sm:block sm:order-1 sm:w-min sm:shrink-0">
          <time class="font-plex-mono text-sm sm:text-base">{localizedDate}</time>
        </div>
        <div class="order-1 sm:order-2 w-full">
          <h2 class="text-lg sm:text-xl tracking-tight font-plex-mono font-semibold group-hover:underline">
            {post.title}{post.leetcode_number ? ` #${post.leetcode_number}` : ''}
          </h2>
          <p class="pt-1 font-plex-sans text-grey-600 hidden sm:block">
            {post.snippet}
          </p>
          {/* Mobile: Date and tags on same line when possible */}
          <div class="flex flex-wrap items-center gap-2 pt-2 sm:hidden">
            <time class="font-plex-mono text-sm shrink-0">{localizedDate}</time>
            {post.tags && post.tags.length > 0 && post.tags.map((tag) => (
              <span class="bg-gray-300 text-center text-black font-plex-mono text-sm px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          {/* Desktop: Tags below snippet */}
          {post.tags && post.tags.length > 0 && (
            <div class="hidden sm:flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag) => (
                <span class="bg-gray-300 text-center text-black font-plex-mono text-sm px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </a>
    </li>
  );
});

export default Post;
