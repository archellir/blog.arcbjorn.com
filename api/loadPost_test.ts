import { loadPost } from "./loadPost.ts";

import { assert, assertEquals } from "$std/testing/asserts.ts";

Deno.test("load post", async () => {
  const post = await loadPost("introduction");
  assert(post);
  assertEquals(post.id, "introduction");
});

Deno.test("load post that does not exist", async () => {
  const post = await loadPost("non-existent post");
  assertEquals(post, null);
});
