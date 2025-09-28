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

    it("respects limit parameter", async () => {
      const postsData = await listPosts({ offset: 0, limit: 3 });
      assert(postsData.posts.length <= 3);
    });

    it("filters by tags", async () => {
      const postsData = await listPosts({ offset: 0, limit: 100, tags: "leetcode" });
      for (const post of postsData.posts) {
        assert(post.tags);
        assert(post.tags.some((tag: string) => tag === "leetcode"));
      }
    });

    it("returns posts sorted by date descending", async () => {
      const postsData = await listPosts({ offset: 0, limit: 10 });
      if (postsData.posts.length > 1) {
        const firstDate = new Date(postsData.posts[0].publishedAt);
        const secondDate = new Date(postsData.posts[1].publishedAt);
        assert(firstDate >= secondDate);
      }
    });
  });
});
