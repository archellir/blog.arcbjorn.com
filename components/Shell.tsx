import { ComponentChildren, FunctionalComponent } from "preact";

import ThemeToggle from "../islands/ThemeToggle.tsx";
import Footer from "./Footer.tsx";
import { AUTHOR_HANDLE } from "../constants.ts";

interface ShellProps {
  children?: ComponentChildren;
}

// One centred column: the wordmark and theme toggle on top, the page's
// content, the footer. The column is as wide as a comfortable line, so the
// page reads the same on a phone and on a wide display.
const Shell: FunctionalComponent<ShellProps> = ({ children }) => (
  <div class="page">
    <a class="skipLink" href="#content">Skip to content</a>
    <header class="header">
      <a class="logo" href="/">{AUTHOR_HANDLE}</a>
      <ThemeToggle />
    </header>
    <main id="content" class="main">
      {children}
    </main>
    <Footer />
  </div>
);

export default Shell;
