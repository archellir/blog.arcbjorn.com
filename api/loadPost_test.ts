import { loadPost } from "./loadPost.ts";

import { assert, assertEquals } from "$std/testing/asserts.ts";
import { describe, it } from "$std/testing/bdd.ts";

describe("load posts", () => {
  it("loads successfully", async () => {
    const post = await loadPost("introduction");
    assert(post);
    assertEquals(post.id, "introduction");
  });

  it("load post that does not exist", async () => {
    const post = await loadPost("non-existent post");
    assertEquals(post, null);
  });
});
