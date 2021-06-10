import Vue from "vue";
import VueI18n from "vue-i18n";
import en from "./en.json";
import he from "./he.json";
import pt from "./pt.json";
import da from "./da.json";
import nl from "./nl.json";
import fr from "./fr.json";
import de from "./de.json";
import ru from "./ru.json";
import es from "./es.json";
import sv from "./sv.json";

Vue.use(VueI18n);

const messages = {
  en,
  he,
  pt,
  da,
  nl,
  fr,
  de,
  ru,
  es,
  sv
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
    case "pt":
      return "Português";
    case "da":
      return "dansk";
    case "nl":
      return "Nederlands";
    case "fr":
      return "français";
    case "de":
      return "Deutsch";
    case "ru":
      return "русский";
    case "es":
      return "Español";
    case "sv":
      return "Svenska";
    default:
      return "English";
  }
};
