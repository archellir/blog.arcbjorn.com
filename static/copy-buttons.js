document.addEventListener("DOMContentLoaded", async function () {
  await processMermaidDiagrams();
  addCopyButtonsToCodeBlocks();
});

async function processMermaidDiagrams() {
  const mermaidBlocks = [...document.querySelectorAll("pre code")]
    .map((block, index) => ({ block, code: block.textContent.trim(), index }))
    .filter(({ code }) =>
      /^(graph |flowchart|sequenceDiagram|classDiagram)/.test(code)
    )
    .map(({ block, code, index }) => {
      const pre = block.closest("pre");
      pre.style.cssText = "opacity: 0; transition: opacity 0.3s ease-in-out";
      return { pre, code, index };
    });

  if (!mermaidBlocks.length) return;

  try {
    while (typeof mermaid === "undefined") {
      await new Promise((r) => setTimeout(r, 50));
    }

    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      themeVariables: {
        primaryColor: "#689d6a",
        primaryTextColor: "#ebdbb2",
        primaryBorderColor: "#3c3836",
        lineColor: "#a89984",
        secondaryColor: "#3c3836",
        tertiaryColor: "#282828",
        background: "#1b1d1e",
        mainBkg: "#282828",
        secondBkg: "#3c3836",
        tertiaryBkg: "#504945",
        fontFamily: '"Source Serif Pro", Georgia, serif',
      },
      flowchart: { curve: "basis", useMaxWidth: true, htmlLabels: true },
    });

    mermaidBlocks.forEach(({ pre, code, index }) => {
      const container = Object.assign(document.createElement("div"), {
        className: "mermaid",
        id: `mermaid-${index}`,
        innerHTML: code,
      });
      container.style.cssText =
        "opacity: 0; transition: opacity 0.3s ease-in-out";
      pre.replaceWith(container);
    });

    await mermaid.run();
    document.querySelectorAll(".mermaid").forEach((d) => d.style.opacity = "1");
  } catch (error) {
    console.error("Mermaid render failed:", error);
    mermaidBlocks.forEach(({ pre }) => pre.style.opacity = "1");
  }
}

function addCopyButtonsToCodeBlocks() {
  document.querySelectorAll(".markdown-body pre:not(.mermaid)").forEach(
    (block) => {
      const button = Object.assign(document.createElement("button"), {
        className: "copy-button",
        textContent: "copy",
        ariaLabel: "Copy code to clipboard",
      });

      button.onclick = async () => {
        const text = (block.querySelector("code") || block).textContent;
        try {
          await navigator.clipboard.writeText(text);
          button.textContent = "copied!";
          button.classList.add("copied");
          setTimeout(() => {
            button.textContent = "copy";
            button.classList.remove("copied");
          }, 2000);
        } catch (err) {
          console.error("Copy failed:", err);
          button.textContent = "error";
          setTimeout(() => button.textContent = "copy", 2000);
        }
      };

      block.appendChild(button);
    },
  );
}
