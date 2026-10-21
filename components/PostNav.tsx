import { FunctionalComponent } from "preact";

import type { IPostSummary } from "../types.ts";
import { ArrowLeft, ArrowRight } from "./Icons.tsx";

interface PostNavProps {
  newer?: IPostSummary;
  older?: IPostSummary;
}

// Closes an article: the neighbouring posts in publication order.
const PostNav: FunctionalComponent<PostNavProps> = ({ newer, older }) => {
  if (!newer && !older) return null;

  return (
    <nav class="postNav" aria-label="Neighbouring posts">
      {older && (
        <a class="postNavLink" href={`/${older.id}`} rel="prev">
          <span class="postNavLabel">Older</span>
          <span class="postNavTitle">
            <ArrowLeft class="postNavIcon" />
            {older.title}
          </span>
        </a>
      )}
      {newer && (
        <a class="postNavLink postNavNext" href={`/${newer.id}`} rel="next">
          <span class="postNavLabel">Newer</span>
          <span class="postNavTitle">
            {newer.title}
            <ArrowRight class="postNavIcon" />
          </span>
        </a>
      )}
    </nav>
  );
};

export default PostNav;
