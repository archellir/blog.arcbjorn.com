import { describe, expect, it } from 'vitest';

import { keepPricesAsText, renderMarkdown } from '../src/lib/markdown';

describe('render markdown', () => {
  it('highlights fenced code with a language label', () => {
    const { html } = renderMarkdown('```go\nfunc main() {}\n```');
    expect(html).toContain('<div class="codeBlock" data-lang="go">');
    expect(html).toContain('<pre tabindex="0"><code class="language-go">');
    expect(html).toContain('<span class="token keyword">func</span>');
  });

  it('escapes code in languages it does not know', () => {
    const { html } = renderMarkdown('```rego\nallow if <x>\n```');
    expect(html).toContain('allow if &lt;x&gt;');
    expect(html).not.toContain('<x>');
  });

  it('resolves aliases and shows a bare dollar for an escaped one', () => {
    const { html } = renderMarkdown('```sh\necho \\$HOME\n```');
    expect(html).toContain('data-lang="bash"');
    expect(html).toContain('$HOME');
    expect(html).not.toContain('\\$');
  });

  it('keeps mermaid sources for the client', () => {
    const { html, hasMermaid } = renderMarkdown('```mermaid\ngraph LR\n  A --> B\n```');
    expect(hasMermaid).toBe(true);
    expect(html).toContain('<pre class="mermaid" tabindex="0">graph LR');
    expect(html).toContain('A --&gt; B');
  });

  it('starts content headings at h2, never skips a level, and links them', () => {
    const { html, headings } = renderMarkdown(
      '# Top\n\n## Go\n\n#### Array iteration\n\n### Back up\n'
    );
    expect(html).toContain(
      '<h2 id="top">Top<a class="anchor" href="#top" aria-label="Link to this section">#</a></h2>'
    );
    expect(html).toContain('<h2 id="go">');
    expect(html).toContain('<h3 id="array-iteration">');
    expect(html).toContain('<h3 id="back-up">');
    expect(headings.map(heading => heading.text)).toEqual(['Top', 'Go']);
  });

  it('opens external links in a new tab and leaves internal ones alone', () => {
    const { html } = renderMarkdown('[out](https://example.com) and [in](/two-sum)');
    expect(html).toContain(
      '<a href="https://example.com" target="_blank" rel="noopener noreferrer">out</a>'
    );
    expect(html).toContain('<a href="/two-sum">in</a>');
  });

  it('wraps tables so they can scroll', () => {
    const { html } = renderMarkdown('| a | b |\n|---|---|\n| 1 | 2 |');
    expect(html).toContain('<div class="tableWrap" tabindex="0"><table>');
  });

  it('renders inline maths and reports it', () => {
    const { html, hasMath } = renderMarkdown('Time complexity: $O(n)$ here.');
    expect(hasMath).toBe(true);
    expect(html).toContain('class="katex');
  });

  it('keeps prices out of the maths pass', () => {
    const { html, hasMath } = renderMarkdown(
      'Plans: $30/mo, X Premium+ $40/mo, or API. Still $O(n)$ here.'
    );
    expect(html).toContain('$30/mo, X Premium+ $40/mo');
    expect(hasMath).toBe(true);
    expect(keepPricesAsText('a $1 and $2')).toBe('a \\$1 and \\$2');
  });

  it('escapes greater-than inside highlighted code', () => {
    const { html } = renderMarkdown('```go\nif n >= 2 { x := a -> b }\n```');
    const code = html.split('<code')[1].split('</code>')[0];
    expect(code).toContain('&gt;=');
    expect(code).not.toMatch(/[^"n]>[^<]/);
  });

  it('renders footnotes with the GitHub markup', () => {
    const { html } = renderMarkdown('Claim.[^1]\n\n[^1]: Source.');
    expect(html).toContain('data-footnote-ref');
    expect(html).toContain('class="footnotes"');
    expect(html).not.toContain('class="anchor" href="#footnote-label"');
  });

  it('lazy-loads images', () => {
    const { html } = renderMarkdown('![alt](/images/a.png "title")');
    expect(html).toContain(
      '<img src="/images/a.png" alt="alt" title="title" loading="lazy" decoding="async">'
    );
  });
});

describe('table headers', () => {
  it('scopes column headers and makes the first column row headers when the corner is empty', () => {
    const { html } = renderMarkdown('| | Eclipse | MegaETH |\n|---|---|---|\n| TPS | 9k | 20k |');
    expect(html).toContain('<td></td>');
    expect(html).toContain('<th scope="col">Eclipse</th>');
    expect(html).toContain('<th scope="row">TPS</th>');
    expect(html).toContain('<td>9k</td>');
  });

  it('leaves a table with a named first column as data cells', () => {
    const { html } = renderMarkdown('| Metric | Value |\n|---|---|\n| TPS | 9k |');
    expect(html).toContain('<th scope="col">Metric</th>');
    expect(html).toContain('<td>TPS</td>');
  });
});
