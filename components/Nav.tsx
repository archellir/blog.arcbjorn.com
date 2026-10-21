import { FunctionalComponent } from "preact";

import { activeTopic, topicHref, topics } from "../utils/topics.ts";

interface NavProps {
  url: URL;
}

// Closes the left pane: topic filters for the post list.
const Nav: FunctionalComponent<NavProps> = ({ url }) => {
  const active = activeTopic(url);

  return (
    <nav class="nav" aria-label="Topics">
      {topics.map((topic) => {
        const isActive = topic === active;
        return (
          <a
            key={topic.label}
            class={`navLink${isActive ? " activeRoute" : ""}`}
            href={topicHref(topic)}
            aria-current={isActive ? "page" : undefined}
          >
            {topic.label}
          </a>
        );
      })}
    </nav>
  );
};

export default Nav;
