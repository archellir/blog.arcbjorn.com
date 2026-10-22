import { FunctionalComponent } from "preact";

import { AUTHOR_HANDLE, AUTHOR_URL, SITE_NAME } from "../constants.ts";

// The head of the home page: the blog's name, whose it is and what it
// covers, in the blog's own original words.
const HomeIntro: FunctionalComponent = () => (
  <div class="intro">
    <h1 class="title">{SITE_NAME}</h1>
    <p class="lead">
      My name is Oleg{" "}
      <span class="pronunciation">[al'eg]</span>. Online handle is @<a
        class="inlineLink"
        href={AUTHOR_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        {AUTHOR_HANDLE}
      </a>.
    </p>
    <p class="summary">
      Here I share my explorations of system design, algorithms, math, networks,
      databases, operational systems, blockchain, programming languages &amp;
      patterns, web related tech.
    </p>
  </div>
);

export default HomeIntro;
