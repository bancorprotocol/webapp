import Vue from "vue";
import VueI18n from "vue-i18n";
import { en } from "./en";
import { he } from "./he";

Vue.use(VueI18n);

const messages = {
  en,
  he
};

export const i18n = new VueI18n({
  locale: "en",
  fallbackLocale: "en",
  messages
});

//To add a new locale check this list https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes in the 639-1 coulmn
export const getLanguageByLocale = (locale: string): string => {
  switch (locale) {
    case "en":
      return "English";
    case "he":
      return "עברית";
    default:
      return "English";
  }
};
