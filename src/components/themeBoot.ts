/**
 * Theme boot.
 *
 * The inline script below runs in <head>, before first paint. It resolves the
 * visitor's theme from an explicit choice (localStorage) or their OS preference
 * and applies it to <html> so a dark-mode visitor never sees a white flash.
 *
 * Keep this script dependency-free and identical to the rules ThemeProvider
 * uses after hydration, otherwise the two can disagree and the page will flip
 * on load.
 */

export const THEME_STORAGE_KEY = 'lll-theme'
export const THEMES = ['light', 'dark'] as const
export type Theme = (typeof THEMES)[number]

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

/** Inline source for <head>. Must stay self-contained. */
export const themeBootScript = `(function(){try{
var k='${THEME_STORAGE_KEY}',s=null;
try{s=window.localStorage.getItem(k)}catch(e){}
var d=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;
var t=(s==='light'||s==='dark')?s:(d?'dark':'light');
var r=document.documentElement;
r.classList.toggle('dark',t==='dark');
r.setAttribute('data-theme',t);
r.style.colorScheme=t;
}catch(e){}})();`
