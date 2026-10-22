import { FunctionalComponent } from "preact";

import type { IPostSummary } from "../types.ts";
import PostRow from "./PostRow.tsx";

interface RelatedPostsProps {
  posts: IPostSummary[];
}

// A few posts on the same subjects, in the index's own row style.
const RelatedPosts: FunctionalComponent<RelatedPostsProps> = ({ posts }) => {
  if (posts.length === 0) return null;

  return (
    <section class="related" aria-labelledby="related-title">
      <h2 id="related-title" class="relatedTitle">Related</h2>
      <ul class="rows">
        {posts.map((post) => <PostRow key={post.id} post={post} fullDate />)}
      </ul>
    </section>
  );
};

export default RelatedPosts;
