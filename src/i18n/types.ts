export type Lang = "en" | "fr" | "ar" | "zh";

export const LANGS: Lang[] = ["en", "fr", "ar", "zh"];
export const DEFAULT_LANG: Lang = "en";

export const LANG_SHORT: Record<Lang, string> = {
  en: "EN",
  fr: "FR",
  zh: "中",
  ar: "ع",
};

export const LANG_NAMES: Record<Lang, string> = {
  en: "English",
  fr: "Français",
  zh: "中文",
  ar: "العربية",
};

export const RTL_LANGS: readonly Lang[] = ["ar"];
