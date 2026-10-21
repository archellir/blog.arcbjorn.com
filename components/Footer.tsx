import { FunctionalComponent } from "preact";

import { ArrowUpRight } from "./Icons.tsx";
import { AUTHOR, LICENSE_NAME, LICENSE_URL } from "../constants.ts";

// Closes the content pane: who wrote this, under which licence, and the feed.
const Footer: FunctionalComponent = () => (
  <footer class="footer">
    <p class="footerLine">
      <span>{AUTHOR}</span>
      <a
        class="footerLink"
        href={LICENSE_URL}
        target="_blank"
        rel="license noopener noreferrer"
      >
        {LICENSE_NAME}
        <ArrowUpRight class="linkIcon" />
      </a>
      <a class="footerLink" href="/rss">RSS</a>
    </p>
  </footer>
);

export default Footer;
