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
      const postsData = await listPosts();
      assert(postsData.posts.length >= 1);
      assert(postsData.all >= 1);
      const firstPost = postsData.posts[0];
      assert(firstPost);
      assert(firstPost.id);
      assert(firstPost.title);
      assert(firstPost.publishedAt);
    });
  });
});
