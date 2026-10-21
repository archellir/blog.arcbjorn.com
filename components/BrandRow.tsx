import { FunctionalComponent } from "preact";

import ThemeToggle from "../islands/ThemeToggle.tsx";
import { AUTHOR_HANDLE } from "../constants.ts";

const BrandRow: FunctionalComponent = () => (
  <div class="brand">
    <a class="logo" href="/">{AUTHOR_HANDLE}</a>
    <div class="controls">
      <ThemeToggle />
    </div>
  </div>
);

export default BrandRow;
