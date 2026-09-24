export type ThemePreference = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

/** Runs before first paint (inlined in <head>) so the page never flashes the wrong theme. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t==="dark"||((t===null||t==="system")&&window.matchMedia("${DARK_QUERY}").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;

export function readThemePreference(): ThemePreference {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

export function applyTheme(preference: ThemePreference) {
  const dark = preference === "dark" || (preference === "system" && window.matchMedia(DARK_QUERY).matches);
  document.documentElement.classList.toggle("dark", dark);
}

export function saveThemePreference(preference: ThemePreference) {
  try {
    if (preference === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Storage can be blocked (private mode); the theme still applies for this visit.
  }
  applyTheme(preference);
  window.dispatchEvent(new Event("themechange"));
}

/** Store adapter for useSyncExternalStore. */
export function subscribeToTheme(onChange: () => void) {
  const media = window.matchMedia(DARK_QUERY);
  const handleSystemChange = () => {
    if (readThemePreference() === "system") applyTheme("system");
    onChange();
  };
  window.addEventListener("themechange", onChange);
  window.addEventListener("storage", handleSystemChange);
  media.addEventListener("change", handleSystemChange);
  return () => {
    window.removeEventListener("themechange", onChange);
    window.removeEventListener("storage", handleSystemChange);
    media.removeEventListener("change", handleSystemChange);
  };
}
