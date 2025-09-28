import { ComponentChildren, FunctionalComponent } from "preact";
import { CSS, KATEX_CSS } from "$gfm";
import { asset } from "fresh/runtime";
import CodeEnhancer from "../islands/CodeEnhancer.tsx";

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
        <link rel="stylesheet" href={asset("/mermaid-theme.css")} />
      )}

      <main>
        {children}
      </main>

      {includeCodeHighlighting && <CodeEnhancer />}
    </>
  );
};

export default BlogLayout;
