import { ComponentChildren, FunctionalComponent } from "preact";

interface SectionProps {
  id: string;
  title: string;
  // A short line under the heading, such as a count.
  meta?: string;
  children: ComponentChildren;
}

// One row of the content pane: the heading on the left, the section's items
// on the right once the pane is wide enough.
const Section: FunctionalComponent<SectionProps> = (
  { id, title, meta, children },
) => (
  <section id={id} class="section" aria-labelledby={`${id}-title`}>
    <header class="sectionHeader">
      <h2 id={`${id}-title`} class="sectionTitle">{title}</h2>
      {meta && <p class="sectionMeta">{meta}</p>}
    </header>
    <div class="sectionBody">{children}</div>
  </section>
);

export default Section;
