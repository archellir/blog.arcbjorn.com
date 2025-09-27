import { ComponentChildren, FunctionalComponent } from "preact";
import { CSS, KATEX_CSS } from "$gfm";

import Header from "./Header.tsx";
import Footer from "./Footer.tsx";

interface BlogLayoutProps {
  children: ComponentChildren;
  includeCodeHighlighting?: boolean;
}

const BlogLayout: FunctionalComponent<BlogLayoutProps> = ({
  children,
  includeCodeHighlighting = false,
}) => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <style dangerouslySetInnerHTML={{ __html: KATEX_CSS }} />

      {includeCodeHighlighting && (
        <>
          <link rel="stylesheet" href="/gruvbox-theme.css" />
          <link rel="stylesheet" href="/mermaid-theme.css" />
          <script src="/copy-buttons.js"></script>
        </>
      )}

      <Header />

      <main>
        {children}
      </main>

      <Footer />
    </>
  );
};

export default BlogLayout;
