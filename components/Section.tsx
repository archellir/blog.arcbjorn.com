import { ComponentChildren, FunctionalComponent } from "preact";

interface SectionProps {
  id: string;
  title: string;
  // A short line under the heading, such as a count.
  meta?: string;
  children: ComponentChildren;
}

// One block of the content column: the heading, a line under it, then the
// section's items.
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
