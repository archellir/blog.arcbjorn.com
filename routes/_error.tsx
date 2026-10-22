import { define } from "../fresh.ts";
import { HttpError } from "fresh";

import HeadElement from "../components/HeadElement.tsx";
import Shell from "../components/Shell.tsx";
import PageIntro from "../components/PageIntro.tsx";
import { ArrowRight } from "../components/Icons.tsx";
import { listPosts } from "../api/listPosts.ts";
import { countTopics } from "../utils/topics.ts";
import { SITE_NAME } from "../constants.ts";

// One page for every error. Fresh renders it with the status of the error
// that was thrown: 404 for an unknown path or post, 500 otherwise.
export default define.page(async (ctx) => {
  // The nav counts are a nicety; if listing posts is what failed, go without.
  const counts = await listPosts({ offset: 0, limit: 0 })
    .then((all) => countTopics(all.posts))
    .catch(() => undefined);

  const status = ctx.error instanceof HttpError ? ctx.error.status : 500;
  const notFound = status === 404;

  const title = notFound ? "Page not found" : "Something went wrong";
  const description = notFound
    ? `There is nothing at ${ctx.url.pathname}.`
    : "The server hit an error while building this page.";

  return (
    <>
      <HeadElement
        url={ctx.url}
        title={`${title} · ${SITE_NAME}`}
        description={description}
        noindex
      />

      <Shell
        url={ctx.url}
        counts={counts}
        aside={
          <PageIntro title={title}>
            <p class="note">
              {notFound
                ? (
                  <>
                    There is nothing at <code>{ctx.url.pathname}</code>.
                  </>
                )
                : description}
            </p>
            <div class="paths">
              <a href="/" class="path">
                All posts
                <ArrowRight class="pathIcon" />
              </a>
            </div>
          </PageIntro>
        }
      />
    </>
  );
});
