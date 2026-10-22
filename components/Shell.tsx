import { ComponentChildren, FunctionalComponent } from "preact";

import BrandRow from "./BrandRow.tsx";
import Topics from "./Topics.tsx";
import Footer from "./Footer.tsx";

interface ShellProps {
  url: URL;
  // Post count per nav topic, in nav order.
  counts?: number[];
  // The left pane's letter: the blog intro on the home page, the title and
  // metadata on a post, a message on error pages.
  aside: ComponentChildren;
  children?: ComponentChildren;
}

// Two panes, as on arcbjorn.com: a sticky letter on the left (brand row,
// topic nav, intro) and the page's content on the right. Below lg it stacks
// into one column with the nav right under the brand row; on lg the nav
// drops to the pane's foot.
const Shell: FunctionalComponent<ShellProps> = (
  { url, counts, aside, children },
) => (
  <div class="shell">
    <a class="skipLink" href="#content">Skip to content</a>
    <header class="aside">
      <BrandRow />
      <Topics url={url} counts={counts} />
      <div class="intro">{aside}</div>
    </header>
    <main id="content" class="main">
      {children}
      <Footer />
    </main>
  </div>
);

export default Shell;
