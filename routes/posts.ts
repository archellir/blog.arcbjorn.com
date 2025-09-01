import { FreshContext, Handlers } from "$fresh/server.ts";
import { listPosts } from "../api/listPosts.ts";
import { IPostsResponse } from "../types.ts";
import { getListLoadParams } from "../utils/getListParams.ts";

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const listParams = getListLoadParams(req.url);

    const postsData: IPostsResponse = await listPosts(listParams);
    const headers = new Headers({
      "Content-Type": "application/json",
    });

    return new Response(JSON.stringify(postsData), {
      status: 200,
      headers,
    });
  },
};
