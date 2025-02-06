import ar from "~/translations/ar.json";
import en from "~/translations/en.json";
import zh from "~/translations/zh.json";

export const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
  zh: {
    translation: zh,
  },
};

export type Language = keyof typeof resources;
