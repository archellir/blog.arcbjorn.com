import { useEffect } from 'preact/hooks';

import { MoonIcon, SunIcon } from '../components/Icons';
import { applyTheme, currentTheme, hasStoredTheme } from '../lib/theme';

// Both icons are in the markup; the stylesheet shows the one for the current
// theme, so the server render and the first paint always agree.
export default function ThemeToggle() {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    // Follow the system until the reader picks a theme themselves.
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const follow = (event: MediaQueryListEvent) => {
      if (hasStoredTheme()) return;
      applyTheme(event.matches ? 'dark' : 'light', false);
    };
    query.addEventListener('change', follow);
    return () => query.removeEventListener('change', follow);
  }, []);

  const toggle = () => {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      class="themeToggle"
      onClick={toggle}
      aria-label="Toggle light and dark theme"
      title="Toggle theme"
    >
      <SunIcon class="themeIcon themeIconSun" />
      <MoonIcon class="themeIcon themeIconMoon" />
    </button>
  );
}
