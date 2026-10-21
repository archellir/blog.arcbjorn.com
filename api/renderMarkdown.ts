import { render, Renderer } from "$gfm";
import GitHubSlugger from "github-slugger";
import Prism from "prismjs";
import "prismjs/components/prism-go.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-python.js";
import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-yaml.js";
import "prismjs/components/prism-zig.js";
import "prismjs/components/prism-sql.js";
import "prismjs/components/prism-c.js";
import "prismjs/components/prism-cpp.js";
import "prismjs/components/prism-rust.js";
import "prismjs/components/prism-toml.js";
import "prismjs/components/prism-json.js";
import "prismjs/components/prism-java.js";
import "prismjs/components/prism-docker.js";

import type { IHeading } from "../types.ts";
import { extractHeadings } from "../utils/headings.ts";

const LANGUAGE_ALIASES: Record<string, string> = {
  ts: "typescript",
  js: "javascript",
  py: "python",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  yml: "yaml",
  dockerfile: "docker",
  "c++": "cpp",
  golang: "go",
  plaintext: "text",
  txt: "text",
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function grammarFor(language: string): Prism.Grammar | undefined {
  return Object.prototype.hasOwnProperty.call(Prism.languages, language)
    ? Prism.languages[language]
    : undefined;
}

// GitHub-flavored markdown with the blog's own markup: code highlighted at
// render time with a language label, mermaid sources left for the client,
// permalinks on headings, scrollable tables and external links in a new tab.
export class PostRenderer extends Renderer {
  #slugger = new GitHubSlugger();

  constructor() {
    super({ allowMath: true });
  }

  override heading(text: string, level: 1 | 2 | 3 | 4 | 5 | 6, raw: string) {
    const id = this.#slugger.slug(raw);
    return `<h${level} id="${id}">${text}<a class="anchor" href="#${id}" aria-label="Link to this section">#</a></h${level}>\n`;
  }

  override code(code: string, language?: string) {
    const requested = (language ?? "").trim().split(/[\s,]+/)[0].toLowerCase();
    const lang = LANGUAGE_ALIASES[requested] ?? requested;

    // Posts write "\$" inside code so the math pass leaves the dollar alone;
    // readers should see the bare "$".
    const source = code.replace(/\\\$/g, "$");

    if (lang === "math") return super.code(source, lang);
    if (lang === "mermaid") {
      return `<pre class="mermaid">${escapeHtml(source)}</pre>\n`;
    }

    const grammar = lang ? grammarFor(lang) : undefined;
    const body = grammar
      ? Prism.highlight(source, grammar, lang)
      : escapeHtml(source);
    const label = lang ? ` data-lang="${escapeHtml(lang)}"` : "";
    const codeClass = lang ? ` class="language-${escapeHtml(lang)}"` : "";
    return `<div class="codeBlock"${label}><pre><code${codeClass}>${body}</code></pre></div>\n`;
  }

  override table(header: string, body: string) {
    return `<div class="tableWrap">${super.table(header, body)}</div>\n`;
  }

  override link(href: string, title: string | null, text: string) {
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
    if (/^https?:\/\//i.test(href)) {
      return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
    }
    return `<a href="${href}"${titleAttr}>${text}</a>`;
  }

  override image(src: string, title: string | null, alt: string) {
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
    return `<img src="${src}" alt="${
      escapeHtml(alt)
    }"${titleAttr} loading="lazy" decoding="async" />`;
  }
}

export interface IRenderedPost {
  html: string;
  hasMermaid: boolean;
  hasMath: boolean;
  headings: IHeading[];
}

// Posts are first-party content, so the HTML is not sanitized; that keeps
// the classes and attributes the stylesheet and islands rely on.
export function renderMarkdown(markdown: string): IRenderedPost {
  const html = render(markdown, {
    allowMath: true,
    renderer: new PostRenderer(),
    disableHtmlSanitization: true,
  });

  return {
    html,
    hasMermaid: html.includes('<pre class="mermaid">'),
    hasMath: html.includes('class="katex'),
    headings: extractHeadings(html),
  };
}
