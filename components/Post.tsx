import { FunctionalComponent, Ref } from "preact";
import { IPost, IState } from "../types.ts";

interface IPostProps {
  post: IPost;
  locales: IState["locales"];
  measureRef?: Ref<HTMLLIElement>;
}

const Post: FunctionalComponent<IPostProps> = (
  { post, measureRef },
) => {
  const dateFmt = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "short",
  });

  const date = new Date(post.publishedAt);
  const localizedDate = dateFmt.format(date);

  return (
    <li
      class="border-t border-gray-400 py-4 px-2 mx-8 list-none"
      ref={measureRef}
    >
      <a
        href={`/${post.id}`}
        class="p-2 flex flex-col sm:flex-row justify-start items-baseline gap-y-2 gap-x-4 group"
      >
        <div class="font-plex-mono">{localizedDate}</div>
        <div>
          <h2 class="text-lg sm:text-xl tracking-tight font-plex-mono font-semibold group-hover:underline">
            {post.title}
          </h2>
          <p class="pt-1 font-plex-sans text-grey-600 hidden sm:block">
            {post.snippet}
          </p>
        </div>
      </a>
    </li>
  );
};

export default Post;
