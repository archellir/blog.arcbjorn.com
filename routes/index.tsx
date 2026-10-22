import { define } from "../fresh.ts";

import HeadElement from "../components/HeadElement.tsx";
import Shell from "../components/Shell.tsx";
import HomeIntro from "../components/HomeIntro.tsx";
import Topics from "../components/Topics.tsx";
import PostIndex from "../islands/PostIndex.tsx";

import { IPostsResponse } from "../types.ts";
import { listPosts } from "../api/listPosts.ts";
import { getFirstLoadListParams } from "../utils/getListParams.ts";
import {
  activeTopic,
  countTopics,
  postsSectionTitle,
} from "../utils/topics.ts";
import { AUTHOR, SITE_DESCRIPTION, SITE_NAME } from "../constants.ts";

export default define.page(async (ctx) => {
  const url = ctx.url;
  const listParams = getFirstLoadListParams(ctx.req.url);
  const [postsData, everything]: IPostsResponse[] = await Promise.all([
    listPosts(listParams),
    listPosts({ offset: 0, limit: 0 }),
  ]);
  const counts = countTopics(everything.posts);

  const tags = url.searchParams.get("tags") ?? undefined;
  const title = postsSectionTitle(tags);
  // A filter that is not one of the topics (a tag link from a post) gets a
  // line saying so, since nothing in the topic row lights up for it.
  const customFilter = Boolean(tags) && !activeTopic(url);
  const count = `${postsData.all} ${postsData.all === 1 ? "post" : "posts"}`;

  return (
    <>
      <HeadElement
        url={url}
        title={tags ? `${title} · ${SITE_NAME}` : `${SITE_NAME} · ${AUTHOR}`}
        description={SITE_DESCRIPTION}
        image={`${url.origin}/images/og-default.png`}
      />

      <Shell>
        <HomeIntro />
        <Topics url={url} counts={counts} />
        <div class="index">
          {customFilter && (
            <p class="indexNote">
              <span class="indexFilter">Tagged {title}</span>
              <span class="indexCount">{count}</span>
              <a class="indexClear" href="/">All posts</a>
            </p>
          )}
          <PostIndex posts={postsData.posts} all={postsData.all} tags={tags} />
        </div>
      </Shell>
    </>
  );
});
