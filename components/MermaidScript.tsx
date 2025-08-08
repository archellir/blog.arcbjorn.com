import { FunctionalComponent } from "preact";

interface MermaidConfig {
  primaryColor?: string;
  primaryTextColor?: string;
  primaryBorderColor?: string;
  lineColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  background?: string;
  mainBkg?: string;
  secondBkg?: string;
  tertiaryBkg?: string;
  fontFamily?: string;
}

interface MermaidScriptProps {
  config?: MermaidConfig;
}

const defaultConfig: MermaidConfig = {
  primaryColor: '#689d6a',
  primaryTextColor: '#ebdbb2',
  primaryBorderColor: '#3c3836',
  lineColor: '#a89984',
  secondaryColor: '#3c3836',
  tertiaryColor: '#282828',
  background: '#1b1d1e',
  mainBkg: '#282828',
  secondBkg: '#3c3836',
  tertiaryBkg: '#504945',
  fontFamily: '"Source Serif Pro", "Times New Roman", Georgia, serif'
};

const MermaidScript: FunctionalComponent<MermaidScriptProps> = ({ config = defaultConfig }) => {
  return (
    <>
      <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
      <script dangerouslySetInnerHTML={{ __html: `
        window.mermaidConfig = ${JSON.stringify(config)};
      ` }} />
    </>
  );
};

export default MermaidScript;