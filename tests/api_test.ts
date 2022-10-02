import { loadPost } from "../api/loadPost.ts";

import { assert, assertEquals } from "$std/testing/asserts.ts";
import { describe, it } from "$std/testing/bdd.ts";
import { listPosts } from "../api/listPosts.ts";

describe("api", () => {
  describe("load post", () => {
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

  describe("list posts", () => {
    it("lists successfully", async () => {
      const posts = await listPosts();
      assert(posts.length >= 1);
      const last = posts.at(-1);
      assert(last);
      assertEquals(last.id, "introduction");
    });
  });
});
