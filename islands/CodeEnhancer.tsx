import { useEffect } from "preact/hooks";
import Prism from 'prismjs';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-bash';

declare global {
  interface Window {
    mermaid?: any;
  }
}

export default function CodeEnhancer() {
  useEffect(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      if (block.className.includes('language-')) return;

      const code = block.textContent || '';
      if (code.includes('func ') || code.includes('package ')) {
        block.className = 'language-go';
      } else if (code.includes('def ') || code.includes('import ')) {
        block.className = 'language-python';
      } else if (code.includes('fn ') || code.includes('let mut')) {
        block.className = 'language-rust';
      } else if (code.includes('function ') || code.includes('const ')) {
        block.className = 'language-typescript';
      } else if (code.includes('echo ') || code.includes('sudo ')) {
        block.className = 'language-bash';
      } else {
        block.className = 'language-go';
      }
    });

    Prism.highlightAll();

    if (window.mermaid) {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
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
          fontFamily: '"Source Serif Pro", Georgia, serif',
        },
        flowchart: { curve: 'basis', useMaxWidth: true, htmlLabels: true },
      });

      const mermaidBlocks = [...document.querySelectorAll('pre code')]
        .filter((block) => /^(graph |flowchart|sequenceDiagram|classDiagram)/.test(block.textContent?.trim() || ''))
        .map((block, index) => {
          const pre = block.closest('pre');
          const container = document.createElement('div');
          container.className = 'mermaid';
          container.id = `mermaid-${index}`;
          container.innerHTML = block.textContent || '';
          pre?.replaceWith(container);
          return container;
        });

      if (mermaidBlocks.length > 0) {
        window.mermaid.run();
      }
    }

    document.querySelectorAll('.markdown-body pre:not(.mermaid)').forEach((pre) => {
      if (pre.querySelector('.copy-button')) return;

      const button = document.createElement('button');
      button.className = 'copy-button';
      button.textContent = 'copy';
      button.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        background: #666;
        color: white;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        z-index: 10;
      `;

      button.onclick = async () => {
        const code = pre.querySelector('code') || pre;
        try {
          await navigator.clipboard.writeText(code.textContent || '');
          button.textContent = 'copied!';
          setTimeout(() => button.textContent = 'copy', 2000);
        } catch (err) {
          button.textContent = 'error';
          setTimeout(() => button.textContent = 'copy', 2000);
        }
      };

      (pre as HTMLElement).style.position = 'relative';
      pre.appendChild(button);
    });
  }, []);

  return null;
}