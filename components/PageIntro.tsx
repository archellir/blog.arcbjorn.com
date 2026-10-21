import { ComponentChildren, FunctionalComponent } from "preact";

interface PageIntroProps {
  title: string;
  children?: ComponentChildren;
}

// Left-pane intro for pages other than home: a title and optionally a line
// or two beneath.
const PageIntro: FunctionalComponent<PageIntroProps> = (
  { title, children },
) => (
  <div class="letter">
    <h1 class="title pageTitle">{title}</h1>
    {children}
  </div>
);

export default PageIntro;
