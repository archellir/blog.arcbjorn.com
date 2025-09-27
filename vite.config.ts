import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

const plugins = [fresh()];
// Allow disabling Tailwind plugin to work around oxide install issues
if (Deno.env.get("NO_TAILWIND") !== "1") {
  plugins.push(tailwindcss());
}

export default defineConfig({
  plugins,
});
