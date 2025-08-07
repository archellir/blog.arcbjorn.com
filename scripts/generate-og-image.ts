import { createCanvas } from "https://deno.land/x/canvas@v1.4.1/mod.ts";

const width = 1200;
const height = 630;

const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

// Dark background matching website
ctx.fillStyle = "#1b1d1e";
ctx.fillRect(0, 0, width, height);

// Subtle grid effect using website gray
ctx.strokeStyle = "#374151";
ctx.lineWidth = 1;
ctx.globalAlpha = 0.2;

// Vertical lines
for (let x = 0; x < width; x += 60) {
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, height);
  ctx.stroke();
}

// Horizontal lines with perspective
for (let y = height * 0.5; y < height; y += 30) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.stroke();
}

ctx.globalAlpha = 1;

// Very subtle gradient using grays only
const gradient = ctx.createLinearGradient(0, 0, width, height);
gradient.addColorStop(0, "rgba(55, 65, 81, 0.1)"); // #374151 with low opacity
gradient.addColorStop(1, "rgba(31, 41, 55, 0.1)"); // #1f2937 with low opacity
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, width, height);

// Geometric shapes in gray
ctx.strokeStyle = "#9ca3af"; // Website gray color
ctx.lineWidth = 2;
ctx.globalAlpha = 0.4;

// Top left corner accent
ctx.beginPath();
ctx.moveTo(0, 80);
ctx.lineTo(80, 80);
ctx.lineTo(80, 0);
ctx.stroke();

// Bottom right corner accent
ctx.beginPath();
ctx.moveTo(width, height - 80);
ctx.lineTo(width - 80, height - 80);
ctx.lineTo(width - 80, height);
ctx.stroke();

// Hexagon shapes
function drawHexagon(x: number, y: number, size: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const hx = x + size * Math.cos(angle);
    const hy = y + size * Math.sin(angle);
    if (i === 0) ctx.moveTo(hx, hy);
    else ctx.lineTo(hx, hy);
  }
  ctx.closePath();
  ctx.stroke();
}

ctx.globalAlpha = 0.2;
ctx.strokeStyle = "#6b7280"; // Gray-500
drawHexagon(150, 150, 50);
drawHexagon(width - 150, height - 150, 50);
drawHexagon(width - 200, 200, 30);

// Main text - arcbjorn
ctx.globalAlpha = 1;
ctx.fillStyle = "#f3f4f6"; // Website light gray
ctx.font = "bold 56px monospace";
ctx.textAlign = "center";
ctx.fillText("arcbjorn", width / 2, height / 2);

// Tech accent lines around text in gray
ctx.strokeStyle = "#6b7280";
ctx.lineWidth = 2;
ctx.globalAlpha = 0.5;

// Left accent
ctx.beginPath();
ctx.moveTo(width / 2 - 200, height / 2 - 10);
ctx.lineTo(width / 2 - 150, height / 2 - 10);
ctx.stroke();

// Right accent
ctx.beginPath();
ctx.moveTo(width / 2 + 150, height / 2 - 10);
ctx.lineTo(width / 2 + 200, height / 2 - 10);
ctx.stroke();

// "grokking" in bottom right corner
ctx.globalAlpha = 1;
ctx.fillStyle = "#9ca3af"; // Gray text
ctx.font = "24px monospace";
ctx.textAlign = "right";
ctx.fillText("grokking", width - 50, height - 40);

// Subtle circuit lines
ctx.globalAlpha = 0.1;
ctx.strokeStyle = "#4b5563";
ctx.lineWidth = 1;

// Circuit pattern 1
ctx.beginPath();
ctx.moveTo(100, 300);
ctx.lineTo(200, 300);
ctx.lineTo(200, 250);
ctx.stroke();

// Circuit pattern 2
ctx.beginPath();
ctx.moveTo(width - 100, 200);
ctx.lineTo(width - 200, 200);
ctx.lineTo(width - 200, 150);
ctx.stroke();

// Save the image
const buffer = canvas.toBuffer("image/png");
await Deno.writeFile("./static/images/og-default.png", buffer);

console.log("Generated cyberpunk OG image at ./static/images/og-default.png");