import { useEffect } from "preact/hooks";
import { IS_BROWSER } from "fresh/runtime";

import { MoonIcon, SunIcon } from "../components/Icons.tsx";
import { applyTheme, currentTheme, hasStoredTheme } from "../utils/theme.ts";

// Both icons are in the markup; the stylesheet shows the one for the current
// theme, so the server render and the first paint always agree.
export default function ThemeToggle() {
  useEffect(() => {
    if (!IS_BROWSER || !globalThis.matchMedia) return;

    // Follow the system until the reader picks a theme themselves.
    const query = globalThis.matchMedia("(prefers-color-scheme: dark)");
    const follow = (event: MediaQueryListEvent) => {
      if (hasStoredTheme()) return;
      applyTheme(event.matches ? "dark" : "light", false);
    };
    query.addEventListener("change", follow);
    return () => query.removeEventListener("change", follow);
  }, []);

  const toggle = () => {
    applyTheme(currentTheme() === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      class="themeToggle"
      onClick={toggle}
      aria-label="Toggle light and dark theme"
    >
      <SunIcon class="themeIcon themeIconSun" />
      <MoonIcon class="themeIcon themeIconMoon" />
    </button>
  );
}
