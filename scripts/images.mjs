// Renders the touch icon from the HTML file beside this script, using
// headless Chrome. The social cards are drawn at build time (src/lib/card.ts).
//
//   pnpm images
//
// Set CHROME to the browser binary if it is not in the default macOS place.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const here = path.dirname(fileURLToPath(import.meta.url));
const jobs = [{ page: 'touch-icon.html', out: '../public/apple-touch-icon.png', w: 180, h: 180 }];

for (const job of jobs) {
  const out = path.resolve(here, job.out);
  const result = spawnSync(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--window-size=${job.w},${job.h}`,
      '--virtual-time-budget=4000',
      `--screenshot=${out}`,
      `file://${path.join(here, job.page)}`,
    ],
    { stdio: 'pipe' }
  );
  if (result.status !== 0) throw new Error(result.stderr.toString());
  console.log(`wrote ${job.out}`);
}
