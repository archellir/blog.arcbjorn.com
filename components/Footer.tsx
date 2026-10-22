import { FunctionalComponent } from "preact";

import { ArrowUpRight } from "./Icons.tsx";
import { AUTHOR, FIRST_YEAR, LICENSE_NAME, LICENSE_URL } from "../constants.ts";

// Closes the page: who wrote this, since when, under which licence, and the
// feed.
const Footer: FunctionalComponent = () => {
  const year = new Date().getFullYear();
  const years = year > FIRST_YEAR ? `${FIRST_YEAR}–${year}` : `${year}`;

  return (
    <footer class="footer">
      <p class="footerLine">
        <span>{AUTHOR}</span>
        <span class="footerYears">{years}</span>
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
};

export default Footer;
