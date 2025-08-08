// Blog post functionality: Mermaid diagrams and copy buttons
document.addEventListener('DOMContentLoaded', function() {
  initializeMermaid();
  processMermaidCodeBlocks();
  addCopyButtonsToCodeBlocks();
});

function initializeMermaid() {
  if (typeof mermaid === 'undefined') {
    return;
  }
  
  mermaid.initialize({
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
      fontFamily: '"Source Serif Pro", "Times New Roman", Georgia, serif'
    },
    flowchart: {
      curve: 'basis',
      useMaxWidth: true,
      htmlLabels: true
    }
  });
}

function processMermaidCodeBlocks() {
  const allCodeBlocks = document.querySelectorAll('pre code');
  
  allCodeBlocks.forEach(function(block, index) {
    const code = block.textContent.trim();
    
    if (isMermaidDiagram(code)) {
      const containerId = 'mermaid-' + index;
      
      const container = document.createElement('div');
      container.className = 'mermaid';
      container.id = containerId;
      container.innerHTML = code;
      
      block.closest('pre').replaceWith(container);
    }
  });
  
  // Render all mermaid diagrams
  setTimeout(function() {
    if (typeof mermaid !== 'undefined') {
      mermaid.run();
    }
  }, 100);
}

function isMermaidDiagram(code) {
  return code.startsWith('graph ') || 
         code.includes('graph TD') || 
         code.includes('graph LR');
}

function addCopyButtonsToCodeBlocks() {
  const codeBlocks = document.querySelectorAll('.markdown-body pre:not(.mermaid)');
  
  codeBlocks.forEach(function(block) {
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.textContent = 'copy';
    button.setAttribute('aria-label', 'Copy code to clipboard');
    
    button.addEventListener('click', function() {
      copyCodeToClipboard(block, button);
    });
    
    block.appendChild(button);
  });
}

async function copyCodeToClipboard(block, button) {
  const code = block.querySelector('code');
  const text = code ? code.textContent : block.textContent;
  
  try {
    await navigator.clipboard.writeText(text);
    showCopySuccess(button);
  } catch (err) {
    console.error('Failed to copy:', err);
    showCopyError(button);
  }
}

function showCopySuccess(button) {
  button.textContent = 'copied!';
  button.classList.add('copied');
  
  setTimeout(function() {
    button.textContent = 'copy';
    button.classList.remove('copied');
  }, 2000);
}

function showCopyError(button) {
  button.textContent = 'error';
  setTimeout(function() {
    button.textContent = 'copy';
  }, 2000);
}