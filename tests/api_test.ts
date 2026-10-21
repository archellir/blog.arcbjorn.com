import { loadPost } from "../api/loadPost.ts";
import { listPosts } from "../api/listPosts.ts";
import { renderMarkdown } from "../api/renderMarkdown.ts";

import {
  assert,
  assertEquals,
  assertStringIncludes,
} from "$std/testing/asserts.ts";
import { describe, it } from "$std/testing/bdd.ts";

import { parseTags, tagHref } from "../utils/tags.ts";
import { activeTopic, postsSectionTitle } from "../utils/topics.ts";
import { readingTime } from "../utils/readingTime.ts";
import { extractHeadings } from "../utils/headings.ts";
import { describePost } from "../utils/describePost.ts";
import { formatDate, isoDate } from "../utils/dates.ts";

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
      const postsData = await listPosts({
        offset: 0,
        limit: 100,
        tags: "leetcode",
      });
      assert(postsData.posts.length > 0);
      for (const post of postsData.posts) {
        assert(post.tags);
        assert(post.tags.some((tag: string) => tag === "leetcode"));
      }
    });

    it("matches tags exactly and ignores case", async () => {
      const exact = await listPosts({ offset: 0, limit: 0, tags: "go" });
      const upper = await listPosts({ offset: 0, limit: 0, tags: "GO" });
      assertEquals(exact.all, upper.all);
      for (const post of exact.posts) {
        assert(post.tags?.includes("go"));
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

  describe("render markdown", () => {
    it("highlights fenced code at render time with a language label", () => {
      const { html } = renderMarkdown("```go\nfunc main() {}\n```");
      assertStringIncludes(html, '<div class="codeBlock" data-lang="go">');
      assertStringIncludes(html, '<code class="language-go">');
      assertStringIncludes(html, '<span class="token keyword">func</span>');
    });

    it("leaves unknown languages as plain escaped code", () => {
      const { html } = renderMarkdown("```rego\nx := 1 < 2\n```");
      assertStringIncludes(html, 'data-lang="rego"');
      assertStringIncludes(html, "1 &lt; 2");
    });

    it("unescapes dollars that posts escape for the math pass", () => {
      const { html } = renderMarkdown("```text\nWHERE id = \\$1\n```");
      assertStringIncludes(html, "WHERE id = $1");
      assert(!html.includes("\\$"));
    });

    it("keeps mermaid sources for the client", () => {
      const { html, hasMermaid } = renderMarkdown(
        "```mermaid\ngraph LR\n  A --> B\n```",
      );
      assert(hasMermaid);
      assertStringIncludes(html, '<pre class="mermaid">graph LR');
      assertStringIncludes(html, "A --&gt; B");
    });

    it("adds permalinks to headings and lists them", () => {
      const { html, headings } = renderMarkdown(
        "## Two-Year Gap\n\ntext\n\n## Tags &amp; Pointers\n",
      );
      assertStringIncludes(
        html,
        '<h2 id="two-year-gap">Two-Year Gap<a class="anchor" href="#two-year-gap"',
      );
      assertEquals(headings.map((heading) => heading.text), [
        "Two-Year Gap",
        "Tags & Pointers",
      ]);
    });

    it("opens external links in a new tab and keeps internal ones", () => {
      const { html } = renderMarkdown(
        "[out](https://example.com) and [in](#here)",
      );
      assertStringIncludes(
        html,
        '<a href="https://example.com" target="_blank" rel="noopener noreferrer">out</a>',
      );
      assertStringIncludes(html, '<a href="#here">in</a>');
    });

    it("wraps tables for horizontal scrolling", () => {
      const { html } = renderMarkdown("| a | b |\n|---|---|\n| 1 | 2 |\n");
      assertStringIncludes(html, '<div class="tableWrap"><table>');
    });

    it("renders inline math and reports it", () => {
      const { html, hasMath } = renderMarkdown("Runs in $O(n)$ time.");
      assert(hasMath);
      assertStringIncludes(html, 'class="katex');
    });
  });
});

describe("utils", () => {
  it("parses and links tags", () => {
    assertEquals(parseTags(" Leetcode, Go ,,"), ["leetcode", "go"]);
    assertEquals(parseTags(undefined), []);
    assertEquals(tagHref("C++"), "/?tags=c%2B%2B");
  });

  it("resolves the active topic and section title", () => {
    assertEquals(activeTopic(new URL("http://x/"))?.label, "All posts");
    assertEquals(
      activeTopic(new URL("http://x/?tags=leetcode"))?.label,
      "Leetcode",
    );
    assertEquals(activeTopic(new URL("http://x/?tags=go")), undefined);
    assertEquals(activeTopic(new URL("http://x/two-sum")), undefined);
    assertEquals(postsSectionTitle(undefined), "Posts");
    assertEquals(postsSectionTitle("leetcode"), "Leetcode");
    assertEquals(postsSectionTitle("go,typescript"), "go · typescript");
  });

  it("estimates reading time", () => {
    assertEquals(readingTime("one two three"), 1);
    assertEquals(readingTime(Array(660).fill("word").join(" ")), 3);
  });

  it("extracts headings without markup", () => {
    const headings = extractHeadings(
      '<h2 id="a">Plain<a class="anchor" href="#a">#</a></h2><h3 id="b">Skip</h3><h2 id="c"><code>x</code> &amp; y</h2>',
    );
    assertEquals(headings, [
      { id: "a", text: "Plain" },
      { id: "c", text: "x & y" },
    ]);
  });

  it("describes posts without a snippet", () => {
    const base = {
      id: "x",
      title: "Two sum",
      publishedAt: "2023-02-24",
      content: "",
    };
    assertEquals(
      describePost({
        ...base,
        leetcode_number: 1,
        tags: ["leetcode", "go", "typescript"],
      }),
      "Leetcode 1: Two sum. Solutions in Go and TypeScript.",
    );
    assertEquals(
      describePost({ ...base, snippet: "Given" }),
      "Given",
    );
    assertEquals(
      describePost({ ...base, title: "Notes" }),
      "Notes. Notes by Oleg Luganskiy.",
    );
  });

  it("formats dates and survives bad locales", () => {
    assertEquals(isoDate("2026-07-04 12:00"), "2026-07-04");
    assertEquals(formatDate("2026-07-04 12:00", ["*", "en-GB"]), "4 July 2026");
    assertEquals(formatDate("not a date", ["en"]), "not a date");
  });
});
