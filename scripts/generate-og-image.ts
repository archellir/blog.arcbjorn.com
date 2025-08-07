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
ctx.globalAlpha = 0.15;

// Vertical lines
for (let x = 0; x < width; x += 40) {
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, height);
  ctx.stroke();
}

// Horizontal lines with perspective
for (let y = height * 0.4; y < height; y += 25) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.stroke();
}

ctx.globalAlpha = 1;

// Very subtle gradient using grays only
const gradient = ctx.createLinearGradient(0, 0, width, height);
gradient.addColorStop(0, "rgba(55, 65, 81, 0.05)");
gradient.addColorStop(1, "rgba(31, 41, 55, 0.1)");
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, width, height);

// Function to draw various cyberpunk shapes
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

function drawTriangle(x: number, y: number, size: number, rotation: number = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(-size * 0.866, size * 0.5);
  ctx.lineTo(size * 0.866, size * 0.5);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function drawCircuit(x: number, y: number, length: number, direction: string) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  if (direction === 'right') {
    ctx.lineTo(x + length, y);
    ctx.lineTo(x + length, y - 20);
  } else if (direction === 'left') {
    ctx.lineTo(x - length, y);
    ctx.lineTo(x - length, y + 20);
  } else if (direction === 'down') {
    ctx.lineTo(x, y + length);
    ctx.lineTo(x + 20, y + length);
  }
  ctx.stroke();
  
  // Add connection dots
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fill();
}

// Multiple hexagons
ctx.globalAlpha = 0.3;
ctx.strokeStyle = "#6b7280";
ctx.lineWidth = 2;
drawHexagon(120, 120, 40);
drawHexagon(200, 180, 25);
drawHexagon(width - 150, height - 120, 45);
drawHexagon(width - 250, height - 200, 30);
drawHexagon(width / 2, 100, 35);
drawHexagon(100, height - 150, 40);

// Triangles
ctx.globalAlpha = 0.25;
ctx.strokeStyle = "#9ca3af";
drawTriangle(300, 150, 30, Math.PI / 4);
drawTriangle(width - 300, 200, 25, -Math.PI / 3);
drawTriangle(width / 2 + 200, height - 180, 35, Math.PI / 2);
drawTriangle(150, height / 2, 30, 0);

// Circuit patterns
ctx.globalAlpha = 0.2;
ctx.strokeStyle = "#4b5563";
ctx.lineWidth = 1;
ctx.fillStyle = "#4b5563";

drawCircuit(50, 250, 100, 'right');
drawCircuit(width - 100, 150, 80, 'left');
drawCircuit(300, 50, 60, 'down');
drawCircuit(width - 200, height - 250, 90, 'right');
drawCircuit(width / 2 - 100, 200, 70, 'down');

// Corner accents
ctx.globalAlpha = 0.4;
ctx.strokeStyle = "#9ca3af";
ctx.lineWidth = 2;

// All four corners
ctx.beginPath();
ctx.moveTo(0, 60);
ctx.lineTo(60, 60);
ctx.lineTo(60, 0);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(width, 60);
ctx.lineTo(width - 60, 60);
ctx.lineTo(width - 60, 0);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(0, height - 60);
ctx.lineTo(60, height - 60);
ctx.lineTo(60, height);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(width, height - 60);
ctx.lineTo(width - 60, height - 60);
ctx.lineTo(width - 60, height);
ctx.stroke();

// Rectangular frames
ctx.globalAlpha = 0.15;
ctx.strokeStyle = "#6b7280";
ctx.strokeRect(150, 250, 200, 100);
ctx.strokeRect(width - 350, 180, 150, 80);

// Diamond shape
ctx.globalAlpha = 0.25;
ctx.beginPath();
ctx.moveTo(width / 2, height / 2 - 80);
ctx.lineTo(width / 2 + 60, height / 2);
ctx.lineTo(width / 2, height / 2 + 80);
ctx.lineTo(width / 2 - 60, height / 2);
ctx.closePath();
ctx.stroke();

// "grokking..." in center bottom
ctx.globalAlpha = 1;
ctx.fillStyle = "#9ca3af";
ctx.font = "28px monospace";
ctx.textAlign = "center";
ctx.fillText("grokking...", width / 2, height - 50);

// Save the image
const buffer = canvas.toBuffer("image/png");
await Deno.writeFile("./static/images/og-default.png", buffer);

console.log("Generated cyberpunk OG image at ./static/images/og-default.png");