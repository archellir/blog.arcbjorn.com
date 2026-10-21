import { ComponentChildren, FunctionalComponent } from "preact";

import BrandRow from "./BrandRow.tsx";
import Nav from "./Nav.tsx";
import Footer from "./Footer.tsx";

interface ShellProps {
  url: URL;
  // The left pane's letter: the blog intro on the home page, the title and
  // metadata on a post, a message on error pages.
  aside: ComponentChildren;
  children?: ComponentChildren;
}

// Two panes: a sticky letter on the left (brand, intro, nav) and the page's
// content on the right. Stacks into a single column below lg.
const Shell: FunctionalComponent<ShellProps> = ({ url, aside, children }) => (
  <div class="shell">
    <a class="skipLink" href="#content">Skip to content</a>
    <header class="aside">
      <BrandRow />
      <div class="intro">{aside}</div>
      <Nav url={url} />
    </header>
    <main id="content" class="main">
      {children}
      <Footer />
    </main>
  </div>
);

export default Shell;
