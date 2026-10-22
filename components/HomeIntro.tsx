import { FunctionalComponent } from "preact";

import { SITE_NAME } from "../constants.ts";

// The head of the home page: the blog's name. Whose it is, the header and
// footer already say; what it covers, the topic row beneath shows.
const HomeIntro: FunctionalComponent = () => (
  <div class="intro">
    <h1 class="title">{SITE_NAME}</h1>
  </div>
);

export default HomeIntro;
