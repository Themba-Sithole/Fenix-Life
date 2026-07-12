export type FenixTheme = "light" | "dark";

export const FENIX_THEME_STORAGE_KEY = "fenix-theme";

export function readStoredTheme(): FenixTheme {
  try {
    const stored = localStorage.getItem(FENIX_THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
  } catch {
    // Ignore storage access errors (private mode, etc.).
  }
  return "dark";
}

export function applyTheme(theme: FenixTheme): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem(FENIX_THEME_STORAGE_KEY, theme);
  } catch {
    // Preference still applies for this session.
  }
}

export function toggleTheme(current: FenixTheme): FenixTheme {
  const next: FenixTheme = current === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}
