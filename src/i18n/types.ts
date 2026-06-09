export type Lang = "en" | "fr" | "es" | "zh" | "ar" | "sw" | "pt";

export const LANGS: Lang[] = ["en", "fr", "es", "zh", "ar", "sw", "pt"];
export const DEFAULT_LANG: Lang = "en";

export const LANG_SHORT: Record<Lang, string> = {
  en: "EN",
  fr: "FR",
  es: "ES",
  zh: "中",
  ar: "ع",
  sw: "SW",
  pt: "PT",
};

export const LANG_NAMES: Record<Lang, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  zh: "中文",
  ar: "العربية",
  sw: "Kiswahili",
  pt: "Português",
};

export const RTL_LANGS: readonly Lang[] = ["ar"];
