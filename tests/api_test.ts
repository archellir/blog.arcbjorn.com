import { loadPost } from "../api/loadPost.ts";
import { listPosts } from "../api/listPosts.ts";
import { renderMarkdown } from "../api/renderMarkdown.ts";

import { assert, assertEquals, assertStringIncludes } from "@std/assert";
import { describe, it } from "@std/testing/bdd";

import { parseTags, tagHref } from "../utils/tags.ts";
import {
  activeTopic,
  countTopics,
  postsSectionTitle,
} from "../utils/topics.ts";
import { groupByYear } from "../utils/groupPosts.ts";
import { relatedPosts } from "../utils/related.ts";
import { readingTime } from "../utils/readingTime.ts";
import { extractHeadings } from "../utils/headings.ts";
import { describePost } from "../utils/describePost.ts";
import { formatDate, isoDate, shortDate, yearOf } from "../utils/dates.ts";

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
      assertStringIncludes(html, '<pre class="mermaid" tabindex="0">graph LR');
      assertStringIncludes(html, "A --&gt; B");
    });

    it("starts content headings at h2 and never skips a level", () => {
      const { html, headings } = renderMarkdown(
        "# Top\n\n## Go\n\n#### Array iteration\n\n### Back up\n",
      );
      assertStringIncludes(html, '<h2 id="top">');
      assertStringIncludes(html, '<h2 id="go">');
      assertStringIncludes(html, '<h3 id="array-iteration">');
      assertStringIncludes(html, '<h3 id="back-up">');
      assertEquals(headings.map((heading) => heading.text), ["Top", "Go"]);
    });

    it("keeps prices out of the math pass", () => {
      const { html, hasMath } = renderMarkdown(
        "Plans: $30/mo, X Premium+ $40/mo, or API. Still $O(n)$ here.",
      );
      assertStringIncludes(html, "$30/mo, X Premium+ $40/mo");
      assert(hasMath);
    });

    it("escapes greater-than inside highlighted code", () => {
      const { html } = renderMarkdown("```go\nif n >= 2 { x := a -> b }\n```");
      assert(!/[^"n]>[^<]/.test(html.split("<code")[1].split("</code>")[0]));
      assertStringIncludes(html, "&gt;=");
    });

    it("makes scrollable code focusable", () => {
      const { html } = renderMarkdown("```go\nx := 1\n```");
      assertStringIncludes(
        html,
        '<pre tabindex="0"><code class="language-go">',
      );
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
      assertStringIncludes(
        html,
        '<div class="tableWrap" tabindex="0"><table>',
      );
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

  it("counts posts per topic and groups them by year", () => {
    const posts = [
      { id: "a", title: "A", publishedAt: "2026-07-04", tags: ["ai", "go"] },
      { id: "b", title: "B", publishedAt: "2025-11-25", tags: ["Leetcode"] },
      { id: "c", title: "C", publishedAt: "2025-03-05", tags: ["linux"] },
      { id: "d", title: "D", publishedAt: "2023-02-24" },
    ];
    // All, Leetcode, Infra, AI, Security, Blockchain
    assertEquals(countTopics(posts), [4, 1, 1, 1, 0, 0]);
    assertEquals(
      groupByYear(posts).map((group) => [group.year, group.posts.length]),
      [["2026", 1], ["2025", 2], ["2023", 1]],
    );
  });

  it("finds related posts by shared tags", () => {
    const posts = [
      { id: "a", title: "A", publishedAt: "2026-01-01", tags: ["go", "ai"] },
      { id: "b", title: "B", publishedAt: "2025-01-01", tags: ["go"] },
      { id: "c", title: "C", publishedAt: "2024-01-01", tags: ["ai", "go"] },
      { id: "d", title: "D", publishedAt: "2023-01-01", tags: ["rust"] },
      { id: "e", title: "E", publishedAt: "2022-01-01", tags: ["AI"] },
    ];
    assertEquals(
      relatedPosts(posts[0], posts).map((post) => post.id),
      ["c", "b", "e"],
    );
    assertEquals(relatedPosts(posts[3], posts), []);
    assertEquals(relatedPosts(posts[1], posts, 1).map((p) => p.id), ["a"]);
  });

  it("formats dates and survives bad locales", () => {
    assertEquals(isoDate("2026-07-04 12:00"), "2026-07-04");
    assertEquals(yearOf("2026-07-04 12:00"), "2026");
    assertEquals(shortDate("2026-07-04"), "04 Jul");
    assertEquals(shortDate("2025-09-28 10:00"), "28 Sep");
    assertEquals(shortDate("not a date"), "not a date");
    assertEquals(formatDate("2026-07-04 12:00", ["*", "en-GB"]), "4 July 2026");
    assertEquals(formatDate("not a date", ["en"]), "not a date");
  });
});
