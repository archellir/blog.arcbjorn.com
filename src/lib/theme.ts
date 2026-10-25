export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';

export const THEME_COLORS: Record<Theme, string> = {
  light: '#f9f5ef',
  dark: '#1b1d1e',
};

// Runs inline in <head> before the first paint, so the page never flashes the
// wrong theme. Order of precedence: the stored choice, the system preference,
// then the time of day.
export const THEME_INIT_SCRIPT = `(function(){try{
var s=localStorage.getItem('${THEME_STORAGE_KEY}');var d;
if(s==='dark'||s==='light'){d=s==='dark'}
else if(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches){d=true}
else{var h=new Date().getHours();d=h<=6||h>=20}
var r=document.documentElement;r.classList.toggle('dark',d);r.classList.toggle('light',!d);
var c=d?'${THEME_COLORS.dark}':'${THEME_COLORS.light}';
var m=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<m.length;i++){m[i].setAttribute('content',c)}
}catch(e){}})();`;

export function hasStoredTheme(): boolean {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'dark' || stored === 'light';
  } catch {
    return false;
  }
}

export function currentTheme(): Theme {
  const root = document.documentElement;
  if (root.classList.contains('dark')) return 'dark';
  if (root.classList.contains('light')) return 'light';
  return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: Theme, persist = true): void {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.classList.toggle('light', theme === 'light');
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
    meta.setAttribute('content', THEME_COLORS[theme]);
  }

  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Private mode or blocked storage: the choice lasts for this page.
    }
  }

  globalThis.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}
