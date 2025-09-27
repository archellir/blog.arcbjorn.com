import { define } from "../fresh.ts";
import { listPosts } from "../api/listPosts.ts";
import { IPostsResponse } from "../types.ts";
import { getListLoadParams } from "../utils/getListParams.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const listParams = getListLoadParams(ctx.req.url);

    const postsData: IPostsResponse = await listPosts(listParams);
    const headers = new Headers({
      "Content-Type": "application/json",
    });

    return new Response(JSON.stringify(postsData), {
      status: 200,
      headers,
    });
  },
});
