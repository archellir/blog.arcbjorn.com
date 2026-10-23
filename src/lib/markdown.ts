import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import { SKIP, visit } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';
import GitHubSlugger from 'github-slugger';
import Prism from 'prismjs';
import 'prismjs/components/prism-go.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-yaml.js';
import 'prismjs/components/prism-zig.js';
import 'prismjs/components/prism-sql.js';
import 'prismjs/components/prism-c.js';
import 'prismjs/components/prism-cpp.js';
import 'prismjs/components/prism-rust.js';
import 'prismjs/components/prism-toml.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-java.js';
import 'prismjs/components/prism-docker.js';
import type { Element, Root } from 'hast';
import type { Root as MdRoot } from 'mdast';

import type { IHeading } from './types';

export interface IRenderedPost {
  html: string;
  hasMermaid: boolean;
  hasMath: boolean;
  headings: IHeading[];
}

const LANGUAGE_ALIASES: Record<string, string> = {
  ts: 'typescript',
  js: 'javascript',
  py: 'python',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  yml: 'yaml',
  dockerfile: 'docker',
  'c++': 'cpp',
  golang: 'go',
  plaintext: 'text',
  txt: 'text',
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Prism leaves ">" alone in text; validators would rather see "&gt;". A ">"
// right after a quote or a tag name closes a tag, the rest is text.
function escapeGreaterThan(html: string): string {
  return html.replace(/(?<!")(?<!span)>/g, '&gt;');
}

// The math pass reads " $30/mo ... $40" as a formula. Pandoc's rule tells
// prices apart: a closing dollar followed by a digit is not maths, so both
// dollars get escaped and come out as plain text.
export function keepPricesAsText(markdown: string): string {
  return markdown.replace(
    /(^|\s)\$(\S[^$\n]*?)\$(?=\d)/gm,
    (_match, lead: string, body: string) => `${lead}\\$${body}\\$`
  );
}

function grammarFor(language: string): Prism.Grammar | undefined {
  return Object.prototype.hasOwnProperty.call(Prism.languages, language)
    ? Prism.languages[language]
    : undefined;
}

// Posts write "\$" inside code so the math pass leaves the dollar alone;
// readers should see the bare "$".
function remarkDollarInCode() {
  return (tree: MdRoot) => {
    visit(tree, ['code', 'inlineCode'], node => {
      if ('value' in node && typeof node.value === 'string') {
        node.value = node.value.replace(/\\\$/g, '$');
      }
    });
  };
}

function languageOf(code: Element): string {
  const classes = code.properties?.className;
  const list = Array.isArray(classes) ? classes.map(String) : [];
  const found = list.find(name => name.startsWith('language-'));
  const requested = (found ?? '').slice('language-'.length).toLowerCase();
  return LANGUAGE_ALIASES[requested] ?? requested;
}

function raw(value: string) {
  return { type: 'raw' as const, value };
}

// The blog's own markup: content headings start at h2 and never skip a
// level, with a permalink each; code is highlighted with a language label,
// mermaid sources are left for the client, tables scroll in a wrapper,
// external links open in a new tab, images load lazily. Scrollable regions
// take focus so keyboard users can scroll them.
function rehypePost(out: { headings: IHeading[]; hasMermaid: boolean }) {
  return (tree: Root) => {
    const slugger = new GitHubSlugger();
    let lastLevel = 1;

    visit(tree, 'element', (node: Element, index, parent) => {
      if (!parent || index === undefined) return;

      const heading = node.tagName.match(/^h([1-6])$/);
      if (heading) {
        const id = String(node.properties?.id ?? '');
        // remark-gfm's own footnotes heading keeps its id and stays hidden.
        if (id === 'footnote-label') return SKIP;
        const depth = Number(heading[1]);
        const level = Math.max(2, Math.min(depth, lastLevel + 1));
        lastLevel = level;
        const text = toString(node).trim();
        const slug = slugger.slug(text);
        node.tagName = `h${level}`;
        node.properties = { ...node.properties, id: slug };
        if (level === 2) out.headings.push({ id: slug, text });
        node.children.push({
          type: 'element',
          tagName: 'a',
          properties: {
            className: ['anchor'],
            href: `#${slug}`,
            ariaLabel: 'Link to this section',
          },
          children: [{ type: 'text', value: '#' }],
        });
        return SKIP;
      }

      if (node.tagName === 'pre') {
        const code = node.children.find(
          (child): child is Element => child.type === 'element' && child.tagName === 'code'
        );
        if (!code) return;
        const lang = languageOf(code);
        const source = toString(code).replace(/\n$/, '');
        let html: string;
        if (lang === 'mermaid') {
          out.hasMermaid = true;
          html = `<pre class="mermaid" tabindex="0">${escapeHtml(source)}</pre>`;
        } else {
          const grammar = lang ? grammarFor(lang) : undefined;
          const body = grammar
            ? escapeGreaterThan(Prism.highlight(source, grammar, lang))
            : escapeHtml(source);
          const label = lang ? ` data-lang="${escapeHtml(lang)}"` : '';
          const codeClass = lang ? ` class="language-${escapeHtml(lang)}"` : '';
          html = `<div class="codeBlock"${label}><pre tabindex="0"><code${codeClass}>${body}</code></pre></div>`;
        }
        parent.children[index] = raw(html);
        return SKIP;
      }

      if (node.tagName === 'table') {
        parent.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['tableWrap'], tabIndex: 0 },
          children: [node],
        };
        return SKIP;
      }

      if (node.tagName === 'a') {
        const href = String(node.properties?.href ?? '');
        if (/^https?:\/\//i.test(href)) {
          node.properties = {
            ...node.properties,
            target: '_blank',
            rel: ['noopener', 'noreferrer'],
          };
        }
        return;
      }

      if (node.tagName === 'img') {
        node.properties = { ...node.properties, loading: 'lazy', decoding: 'async' };
      }
    });
  };
}

// GitHub-flavored markdown with inline maths, rendered to HTML the stylesheet
// and the islands understand. Posts are first-party, so nothing is sanitized.
export function renderMarkdown(markdown: string): IRenderedPost {
  const out = { headings: [] as IHeading[], hasMermaid: false };
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkDollarInCode)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeKatex)
    .use(() => rehypePost(out))
    .use(rehypeStringify, { allowDangerousHtml: true })
    .processSync(keepPricesAsText(markdown));
  const html = String(file);

  return {
    html,
    hasMermaid: out.hasMermaid,
    hasMath: html.includes('class="katex'),
    headings: out.headings,
  };
}
