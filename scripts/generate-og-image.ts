import { createCanvas } from "https://deno.land/x/canvas@v1.4.1/mod.ts";

const width = 1200;
const height = 630;

const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

// Dark background matching website
ctx.fillStyle = "#1b1d1e";
ctx.fillRect(0, 0, width, height);

// Subtle grid for PCB effect
ctx.strokeStyle = "#374151";
ctx.lineWidth = 1;
ctx.globalAlpha = 0.05;

for (let x = 0; x < width; x += 30) {
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, height);
  ctx.stroke();
}

for (let y = 0; y < height; y += 30) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.stroke();
}

// Function to draw circuit traces
function drawCircuitTrace(x1: number, y1: number, x2: number, y2: number) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);

  // Create L-shaped traces like real circuits
  if (Math.abs(x2 - x1) > Math.abs(y2 - y1)) {
    ctx.lineTo(x2, y1);
    ctx.lineTo(x2, y2);
  } else {
    ctx.lineTo(x1, y2);
    ctx.lineTo(x2, y2);
  }
  ctx.stroke();

  // Add connection points
  ctx.beginPath();
  ctx.arc(x1, y1, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x2, y2, 4, 0, Math.PI * 2);
  ctx.fill();
}

// Function to draw integrated circuit (IC) chip
function drawICChip(x: number, y: number, width: number, height: number) {
  // Main body
  ctx.fillRect(x, y, width, height);

  // Pins on sides
  const pinCount = 4;
  const pinWidth = 8;
  const pinHeight = 4;

  for (let i = 0; i < pinCount; i++) {
    const pinY = y + (height / (pinCount + 1)) * (i + 1);
    // Left pins
    ctx.fillRect(x - pinWidth, pinY - pinHeight / 2, pinWidth, pinHeight);
    // Right pins
    ctx.fillRect(x + width, pinY - pinHeight / 2, pinWidth, pinHeight);
  }
}

// Function to draw capacitor
function drawCapacitor(x: number, y: number, vertical: boolean = false) {
  ctx.lineWidth = 2;
  if (vertical) {
    ctx.beginPath();
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x, y - 8);
    ctx.moveTo(x - 10, y - 8);
    ctx.lineTo(x + 10, y - 8);
    ctx.moveTo(x - 10, y + 8);
    ctx.lineTo(x + 10, y + 8);
    ctx.moveTo(x, y + 8);
    ctx.lineTo(x, y + 20);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(x - 20, y);
    ctx.lineTo(x - 8, y);
    ctx.moveTo(x - 8, y - 10);
    ctx.lineTo(x - 8, y + 10);
    ctx.moveTo(x + 8, y - 10);
    ctx.lineTo(x + 8, y + 10);
    ctx.moveTo(x + 8, y);
    ctx.lineTo(x + 20, y);
    ctx.stroke();
  }
}

// Circuit traces layer 1
ctx.globalAlpha = 0.3;
ctx.strokeStyle = "#6b7280";
ctx.fillStyle = "#6b7280";
ctx.lineWidth = 3;

// Top left circuit section
drawCircuitTrace(100, 100, 250, 100);
drawCircuitTrace(250, 100, 250, 200);
drawCircuitTrace(250, 200, 400, 200);
drawCircuitTrace(100, 100, 100, 180);

// Top right circuit section
drawCircuitTrace(width - 100, 120, width - 300, 120);
drawCircuitTrace(width - 300, 120, width - 300, 250);
drawCircuitTrace(width - 300, 250, width - 150, 250);

// Bottom left circuit section - more complex
drawCircuitTrace(150, height - 150, 350, height - 150);
drawCircuitTrace(350, height - 150, 350, height - 250);
drawCircuitTrace(150, height - 200, 300, height - 200);
drawCircuitTrace(300, height - 200, 300, height - 100);
drawCircuitTrace(200, height - 250, 200, height - 100);
drawCircuitTrace(200, height - 100, 400, height - 100);

// IC Chips
ctx.globalAlpha = 0.25;
ctx.fillStyle = "#4b5563";
drawICChip(200, 150, 80, 60);
drawICChip(width - 280, 180, 80, 60);
drawICChip(300, height - 220, 80, 60);
drawICChip(width / 2 - 40, 200, 80, 60);

// Capacitors
ctx.globalAlpha = 0.3;
ctx.strokeStyle = "#9ca3af";
drawCapacitor(150, 150, true);
drawCapacitor(width - 150, 200, false);
drawCapacitor(250, height - 180, true);
drawCapacitor(width / 2 + 100, 150, false);

// Circuit traces layer 2
ctx.globalAlpha = 0.25;
ctx.strokeStyle = "#374151";
ctx.fillStyle = "#374151";
ctx.lineWidth = 2;

// Middle circuit network - more complex
drawCircuitTrace(width / 2 - 150, height / 2, width / 2 + 150, height / 2);
drawCircuitTrace(width / 2, height / 2 - 100, width / 2, height / 2 + 100);
drawCircuitTrace(
  width / 2 - 100,
  height / 2 - 50,
  width / 2 + 100,
  height / 2 - 50,
);
drawCircuitTrace(
  width / 2 - 100,
  height / 2 + 50,
  width / 2 + 100,
  height / 2 + 50,
);

// Additional complex traces
drawCircuitTrace(
  width / 2 - 200,
  height / 2 - 80,
  width / 2 - 50,
  height / 2 - 80,
);
drawCircuitTrace(
  width / 2 + 50,
  height / 2 - 80,
  width / 2 + 200,
  height / 2 - 80,
);
drawCircuitTrace(
  width / 2 - 200,
  height / 2 + 80,
  width / 2 - 50,
  height / 2 + 80,
);
drawCircuitTrace(
  width / 2 + 50,
  height / 2 + 80,
  width / 2 + 200,
  height / 2 + 80,
);

// Vertical connections
drawCircuitTrace(
  width / 2 - 200,
  height / 2 - 80,
  width / 2 - 200,
  height / 2 + 80,
);
drawCircuitTrace(
  width / 2 + 200,
  height / 2 - 80,
  width / 2 + 200,
  height / 2 + 80,
);

// Corner accents - circuit style
ctx.globalAlpha = 0.4;
ctx.strokeStyle = "#9ca3af";
ctx.lineWidth = 3;

// Top left corner
ctx.beginPath();
ctx.moveTo(0, 80);
ctx.lineTo(40, 80);
ctx.lineTo(40, 40);
ctx.lineTo(80, 40);
ctx.lineTo(80, 0);
ctx.stroke();

// Top right corner
ctx.beginPath();
ctx.moveTo(width, 80);
ctx.lineTo(width - 40, 80);
ctx.lineTo(width - 40, 40);
ctx.lineTo(width - 80, 40);
ctx.lineTo(width - 80, 0);
ctx.stroke();

// Bottom left corner
ctx.beginPath();
ctx.moveTo(0, height - 80);
ctx.lineTo(40, height - 80);
ctx.lineTo(40, height - 40);
ctx.lineTo(80, height - 40);
ctx.lineTo(80, height);
ctx.stroke();

// Bottom right corner
ctx.beginPath();
ctx.moveTo(width, height - 80);
ctx.lineTo(width - 40, height - 80);
ctx.lineTo(width - 40, height - 40);
ctx.lineTo(width - 80, height - 40);
ctx.lineTo(width - 80, height);
ctx.stroke();

// Additional circuit elements
ctx.globalAlpha = 0.2;
ctx.strokeStyle = "#6b7280";

// Resistor-like elements
for (let i = 0; i < 3; i++) {
  ctx.beginPath();
  const x = 500 + i * 100;
  const y = 350;
  ctx.moveTo(x - 20, y);
  for (let j = 0; j < 4; j++) {
    ctx.lineTo(x - 15 + j * 10, y + (j % 2 === 0 ? -5 : 5));
  }
  ctx.lineTo(x + 20, y);
  ctx.stroke();
}

// More complex circuit traces layer 3
ctx.globalAlpha = 0.15;
ctx.strokeStyle = "#6b7280";
ctx.lineWidth = 2;

// Diagonal circuit paths
drawCircuitTrace(100, 50, 300, 150);
drawCircuitTrace(width - 100, 50, width - 300, 150);
drawCircuitTrace(100, height - 50, 300, height - 150);
drawCircuitTrace(width - 100, height - 50, width - 300, height - 150);

// Cross connections
drawCircuitTrace(450, 100, 550, 200);
drawCircuitTrace(550, 100, 450, 200);
drawCircuitTrace(width - 450, height - 200, width - 550, height - 100);
drawCircuitTrace(width - 550, height - 200, width - 450, height - 100);

// Additional horizontal traces
for (let i = 0; i < 4; i++) {
  const y = 250 + i * 30;
  drawCircuitTrace(500 + i * 20, y, 700 - i * 20, y);
}

// More vertical traces
for (let i = 0; i < 3; i++) {
  const x = 100 + i * 150;
  drawCircuitTrace(x, 300, x, 400);
}

// Via holes (connection points)
ctx.globalAlpha = 0.3;
ctx.fillStyle = "#4b5563";
const viaPositions = [
  { x: 180, y: 250 },
  { x: width - 200, y: 150 },
  { x: width / 2 - 100, y: height - 200 },
  { x: width / 2 + 100, y: 100 },
  { x: 450, y: height / 2 },
  { x: width - 450, y: height / 2 + 50 },
  { x: 300, y: 300 },
  { x: width - 300, y: 300 },
  { x: width / 2, y: 350 },
  { x: 150, y: 450 },
  { x: width - 150, y: 450 },
];

viaPositions.forEach((pos) => {
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
  ctx.fillStyle = "#1b1d1e";
  ctx.fill();
  ctx.fillStyle = "#4b5563";
});

// "grokking..." text
ctx.globalAlpha = 1;
ctx.fillStyle = "#9ca3af"; // Less bright gray
ctx.font = "48px 'Courier New', 'Monaco', 'Consolas', monospace";
ctx.textAlign = "center";
ctx.fillText("grokking...", width / 2, height - 100);

// Save the image
const buffer = canvas.toBuffer("image/png");
await Deno.writeFile("./static/images/og-default.png", buffer);

console.log(
  "Generated cyberpunk circuit board OG image at ./static/images/og-default.png",
);
