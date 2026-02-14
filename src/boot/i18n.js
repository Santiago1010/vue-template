import { createI18n } from "vue-i18n";
import messages from "../i18n";

let defaultLocale = import.meta.env.VITE_LANG_DEFAULT;

if (import.meta.env.VITE_NODE_ENV !== "test") {
  if (localStorage.getItem("language"))
    defaultLocale = localStorage.getItem("language");
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: defaultLocale,
  fallbackLocale: "en",
  availableLocales: ["es", "en"],
  messages,
  syncFiles: true,
});

export default i18n;
