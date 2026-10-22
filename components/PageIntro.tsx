import { ComponentChildren, FunctionalComponent } from "preact";

interface PageIntroProps {
  title: string;
  children?: ComponentChildren;
}

// The head of a page other than home or a post: a title and optionally a
// line or two beneath.
const PageIntro: FunctionalComponent<PageIntroProps> = (
  { title, children },
) => (
  <div class="intro">
    <h1 class="title pageTitle">{title}</h1>
    {children}
  </div>
);

export default PageIntro;
