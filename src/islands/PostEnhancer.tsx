import { useEffect } from 'preact/hooks';

interface PostEnhancerProps {
  // Whether the article has mermaid blocks to draw.
  mermaid: boolean;
}

type MermaidApi = Awaited<typeof import('mermaid')>['default'];
type MermaidConfig = Parameters<MermaidApi['initialize']>[0];

// Copy buttons on every code block.
function addCopyButtons() {
  document.querySelectorAll<HTMLElement>('.codeBlock').forEach(block => {
    if (block.querySelector('.copyButton')) return;
    const code = block.querySelector('code');
    if (!code) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copyButton';
    button.textContent = 'copy';
    button.setAttribute('aria-label', 'Copy code to clipboard');

    let reset: ReturnType<typeof setTimeout> | undefined;
    const flash = (state: 'copied' | 'failed') => {
      button.dataset.state = state;
      button.textContent = state;
      clearTimeout(reset);
      reset = setTimeout(() => {
        delete button.dataset.state;
        button.textContent = 'copy';
      }, 1800);
    };

    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent ?? '');
        flash('copied');
      } catch {
        flash('failed');
      }
    });

    block.appendChild(button);
  });
}

// The computed value of a palette variable as hex, so mermaid's colour maths
// gets a plain colour rather than a color-mix() expression.
function paletteColor(name: string): string {
  const probe = document.createElement('span');
  probe.style.color = `var(${name})`;
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();

  const toHex = (channel: number) =>
    Math.round(Math.min(255, Math.max(0, channel)))
      .toString(16)
      .padStart(2, '0');

  const legacy = computed.match(/rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/);
  if (legacy) {
    return `#${toHex(+legacy[1])}${toHex(+legacy[2])}${toHex(+legacy[3])}`;
  }
  const modern = computed.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (modern) {
    return `#${toHex(+modern[1] * 255)}${toHex(+modern[2] * 255)}${toHex(+modern[3] * 255)}`;
  }
  return computed;
}

function mermaidConfig(): MermaidConfig {
  const bg = paletteColor('--bg');
  const text = paletteColor('--color');
  const line = paletteColor('--lineColor');
  const muted = paletteColor('--mutedColor');
  const surface = paletteColor('--surface');
  const focus = paletteColor('--focusColor');

  return {
    startOnLoad: false,
    theme: 'base',
    fontFamily: "'IBM Plex Mono', monospace",
    themeVariables: {
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: '13px',
      background: bg,
      textColor: text,
      lineColor: muted,
      primaryColor: surface,
      primaryTextColor: text,
      primaryBorderColor: muted,
      secondaryColor: surface,
      secondaryTextColor: text,
      secondaryBorderColor: muted,
      tertiaryColor: bg,
      tertiaryTextColor: text,
      tertiaryBorderColor: line,
      mainBkg: surface,
      nodeBorder: muted,
      clusterBkg: bg,
      clusterBorder: line,
      titleColor: text,
      edgeLabelBackground: bg,
      actorBkg: surface,
      actorBorder: muted,
      actorTextColor: text,
      actorLineColor: muted,
      signalColor: text,
      signalTextColor: text,
      labelBoxBkgColor: surface,
      labelBoxBorderColor: muted,
      labelTextColor: text,
      loopTextColor: text,
      noteBkgColor: surface,
      noteBorderColor: focus,
      noteTextColor: text,
      activationBkgColor: surface,
      activationBorderColor: muted,
    },
    flowchart: {
      curve: 'basis',
      useMaxWidth: true,
      htmlLabels: true,
      padding: 16,
      subGraphTitleMargin: { top: 8, bottom: 8 },
    },
    sequence: { useMaxWidth: true },
  };
}

// Draws the diagrams, and draws them again whenever the theme changes.
// Returns a function that stops any further drawing.
function setupMermaid(): () => void {
  const blocks = [...document.querySelectorAll<HTMLElement>('pre.mermaid')];
  if (blocks.length === 0) return () => {};

  const sources = new Map(blocks.map(block => [block, block.textContent ?? '']));
  let disposed = false;
  let api: MermaidApi | null = null;

  const draw = async () => {
    if (!api) {
      // Bundled as its own chunk: it only downloads on a post with a diagram.
      api = (await import('mermaid')).default;
    }
    if (disposed) return;

    api.initialize(mermaidConfig());
    for (const [block, source] of sources) {
      block.removeAttribute('data-processed');
      block.textContent = source;
    }
    await api.run({ nodes: blocks, suppressErrors: true });
  };

  const redraw = () => {
    draw().catch(error => console.error('Mermaid render failed:', error));
  };

  redraw();
  window.addEventListener('themechange', redraw);
  return () => {
    disposed = true;
    window.removeEventListener('themechange', redraw);
  };
}

export default function PostEnhancer({ mermaid }: PostEnhancerProps) {
  useEffect(() => {
    addCopyButtons();
    if (!mermaid) return;
    return setupMermaid();
  }, [mermaid]);

  return null;
}
