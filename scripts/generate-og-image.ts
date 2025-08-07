import { createCanvas } from "https://deno.land/x/canvas@v1.4.1/mod.ts";

const width = 1200;
const height = 630;

const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

// Background
ctx.fillStyle = "#1b1d1e";
ctx.fillRect(0, 0, width, height);

// Add subtle gradient
const gradient = ctx.createLinearGradient(0, 0, width, height);
gradient.addColorStop(0, "rgba(59, 130, 246, 0.1)");
gradient.addColorStop(1, "rgba(147, 51, 234, 0.1)");
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, width, height);

// Main title
ctx.fillStyle = "#f3f4f6";
ctx.font = "bold 72px monospace";
ctx.fillText("blog.arcbjorn.com", 100, height / 2 - 40);

// Subtitle
ctx.fillStyle = "#9ca3af";
ctx.font = "36px monospace";
ctx.fillText("Programming insights and technical explorations", 100, height / 2 + 40);

// Add decorative elements
ctx.strokeStyle = "#374151";
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(100, height / 2 + 80);
ctx.lineTo(width - 100, height / 2 + 80);
ctx.stroke();

// Save the image
const buffer = canvas.toBuffer("image/png");
await Deno.writeFile("./static/images/og-default.png", buffer);

console.log("Generated OG image at ./static/images/og-default.png");