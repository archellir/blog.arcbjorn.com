import { ComponentChildren, FunctionalComponent } from "preact";

import ThemeToggle from "../islands/ThemeToggle.tsx";
import Footer from "./Footer.tsx";
import { ArrowUpRight } from "./Icons.tsx";
import { AUTHOR_HANDLE, AUTHOR_URL } from "../constants.ts";

interface ShellProps {
  children?: ComponentChildren;
}

// One centred column: the wordmark, the site links and the theme toggle on
// top, the page's content, the footer. The column is as wide as a
// comfortable line, so the page reads the same on a phone and a wide display.
const Shell: FunctionalComponent<ShellProps> = ({ children }) => (
  <div class="page">
    <a class="skipLink" href="#content">Skip to content</a>
    <header class="header">
      <a class="logo" href="/">{AUTHOR_HANDLE}</a>
      <nav class="headerNav" aria-label="Site">
        <a
          class="headerLink"
          href={AUTHOR_URL}
          target="_blank"
          rel="me noopener noreferrer"
        >
          About
          <ArrowUpRight class="linkIcon" />
        </a>
        <a class="headerLink" href="/rss">RSS</a>
        <ThemeToggle />
      </nav>
    </header>
    <main id="content" class="main">
      {children}
    </main>
    <Footer />
  </div>
);

export default Shell;
