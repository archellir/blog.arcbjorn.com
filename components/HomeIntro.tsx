import { FunctionalComponent } from "preact";

import { AUTHOR_HANDLE, AUTHOR_URL, SITE_NAME } from "../constants.ts";

// The head of the home page: the blog's name and whose it is. What it
// covers is the topic row beneath, so it is not said twice.
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
  </div>
);

export default HomeIntro;
