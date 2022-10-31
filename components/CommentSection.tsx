import { FunctionalComponent } from "preact";

export const CommentSection: FunctionalComponent = () => {
  return (
    <script
      src="https://utteranc.es/client.js"
      // @ts-expect-error: specific utteranc API
      repo="archellir/blog.arcbjorn.com"
      issue-term="pathname"
      label="discussion"
      theme="gruvbox-dark"
      crossorigin="anonymous"
      async
    >
    </script>
  );
};
