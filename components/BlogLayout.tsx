import { FunctionalComponent, ComponentChildren } from "preact";
import { asset } from "$fresh/runtime.ts";
import { CSS, KATEX_CSS } from "$gfm";

import Header from "./Header.tsx";
import Footer from "./Footer.tsx";

interface BlogLayoutProps {
  children: ComponentChildren;
  includeCodeHighlighting?: boolean;
}

const BlogLayout: FunctionalComponent<BlogLayoutProps> = ({ 
  children, 
  includeCodeHighlighting = false 
}) => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <style dangerouslySetInnerHTML={{ __html: KATEX_CSS }} />
      
      {includeCodeHighlighting && (
        <>
          <link rel="stylesheet" href={asset("/gruvbox-theme.css")} />
          <link rel="stylesheet" href={asset("/mermaid-theme.css")} />
          <script src={asset("/copy-buttons.js")}></script>
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