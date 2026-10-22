import { FunctionalComponent } from "preact";

import { activeTopic, topicHref, topics } from "../utils/topics.ts";

interface TopicsProps {
  url: URL;
  // Post count per topic, in nav order; omitted when unknown.
  counts?: number[];
}

// The index's filter row: what the posts cover, with a count each. One line
// that scrolls sideways on a narrow screen rather than wrapping.
const Topics: FunctionalComponent<TopicsProps> = ({ url, counts }) => {
  const active = activeTopic(url);

  return (
    <nav class="topics" aria-label="Topics">
      <ul class="topicList">
        {topics.map((topic, index) => {
          const isActive = topic === active;
          return (
            <li key={topic.label} class="topic">
              <a
                class={`topicLink${isActive ? " activeRoute" : ""}`}
                href={topicHref(topic)}
                aria-current={isActive ? "page" : undefined}
              >
                <span class="topicLabel">{topic.label}</span>
                {counts && <span class="topicCount">{counts[index]}</span>}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Topics;
