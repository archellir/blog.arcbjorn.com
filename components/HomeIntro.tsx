import { FunctionalComponent } from "preact";

import { ArrowUpRight } from "./Icons.tsx";
import {
  AUTHOR,
  AUTHOR_HANDLE,
  AUTHOR_URL,
  GITHUB_URL,
  SITE_NAME,
} from "../constants.ts";

// The letter in the left pane of the home page: what this is, whose it is,
// and where else to find them.
const HomeIntro: FunctionalComponent = () => (
  <div class="letter">
    <h1 class="title">{SITE_NAME}</h1>
    <p class="tagline">
      Notes by {AUTHOR}, @{AUTHOR_HANDLE}
    </p>
    <p class="lead">
      Explorations of system design, algorithms, networks, databases, operating
      systems, blockchain, programming languages and the web.
    </p>
    <p class="summary">
      Long-form notes on infrastructure, security, blockchain and AI tooling,
      next to Leetcode solutions in Go, TypeScript, Python and C++.
    </p>

    <ul class="links">
      <li>
        <a
          class="link"
          href={AUTHOR_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          arcbjorn.com
          <ArrowUpRight class="linkIcon" />
        </a>
      </li>
      <li>
        <a
          class="link"
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
          <ArrowUpRight class="linkIcon" />
        </a>
      </li>
      <li>
        <a class="link" href="/rss">RSS</a>
      </li>
    </ul>
  </div>
);

export default HomeIntro;
