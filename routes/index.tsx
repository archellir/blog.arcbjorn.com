import { define } from "../fresh.ts";

import HeadElement from "../components/HeadElement.tsx";
import Shell from "../components/Shell.tsx";
import HomeIntro from "../components/HomeIntro.tsx";
import Section from "../components/Section.tsx";
import PostsList from "../islands/PostsList.tsx";

import { IPostsResponse } from "../types.ts";
import { listPosts } from "../api/listPosts.ts";
import { getFirstLoadListParams } from "../utils/getListParams.ts";
import { postsSectionTitle } from "../utils/topics.ts";
import { SITE_DESCRIPTION, SITE_NAME } from "../constants.ts";

export default define.page(async (ctx) => {
  const url = ctx.url;
  const listParams = getFirstLoadListParams(ctx.req.url);
  const postsData: IPostsResponse = await listPosts(listParams);

  const tags = url.searchParams.get("tags") ?? undefined;
  const sectionTitle = postsSectionTitle(tags);
  const count = `${postsData.all} ${postsData.all === 1 ? "post" : "posts"}`;

  return (
    <>
      <HeadElement
        url={url}
        title={tags ? `${sectionTitle} · ${SITE_NAME}` : SITE_NAME}
        description={SITE_DESCRIPTION}
        image={`${url.origin}/images/og-default.png`}
      />

      <Shell url={url} aside={<HomeIntro />}>
        <div class="sections">
          <Section id="posts" title={sectionTitle} meta={count}>
            <PostsList
              posts={postsData.posts}
              all={postsData.all}
              tags={tags}
            />
          </Section>
        </div>
      </Shell>
    </>
  );
});
