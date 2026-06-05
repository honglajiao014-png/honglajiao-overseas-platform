export type Lang = "en" | "fr" | "es" | "zh";

export const LANGS: Lang[] = ["en", "fr", "es", "zh"];
export const DEFAULT_LANG: Lang = "en";

export const LANG_SHORT: Record<Lang, string> = {
  en: "EN",
  fr: "FR",
  es: "ES",
  zh: "中",
};

export const LANG_NAMES: Record<Lang, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  zh: "中文",
};
