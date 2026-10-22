// Renders the social preview image and the touch icon from the HTML files
// beside this script, using headless Chrome so they use the site's own font.
//
//   deno run -A scripts/images.ts
//
// Set CHROME to the browser binary if it is not in the default macOS place.

const CHROME = Deno.env.get("CHROME") ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const here = new URL(".", import.meta.url).pathname;
const jobs = [
  {
    page: "og-image.html",
    out: "../static/images/og-default.png",
    w: 1200,
    h: 630,
  },
  {
    page: "touch-icon.html",
    out: "../static/apple-touch-icon.png",
    w: 180,
    h: 180,
  },
];

for (const job of jobs) {
  const out = `${here}${job.out}`;
  const { success, stderr } = await new Deno.Command(CHROME, {
    args: [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      `--window-size=${job.w},${job.h}`,
      "--virtual-time-budget=4000",
      `--screenshot=${out}`,
      `file://${here}${job.page}`,
    ],
  }).output();
  if (!success) throw new Error(new TextDecoder().decode(stderr));
  console.log(`wrote ${job.out}`);
}
