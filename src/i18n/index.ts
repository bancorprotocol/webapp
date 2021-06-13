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
//import es from "./es.json";
import sv from "./sv.json";
//import zh from "./zh.json";

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
  //es,
  sv
  //zh
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
      return "Dansk";
    case "nl":
      return "Nederlands";
    case "fr":
      return "Français";
    case "de":
      return "Deutsch";
    case "ru":
      return "Pусский";
    // case "es":
    //   return "Español";
    case "sv":
      return "Svenska";
    // case "zh":
    //   return "中文";
    default:
      return "English";
  }
};

export const getLanguageByLocaleInEnglish = (locale: string): string => {
  switch (locale) {
    case "en":
      return "English";
    case "he":
      return "Hebrew";
    case "pt":
      return "Portuguese";
    case "da":
      return "Danish";
    case "nl":
      return "Dutch";
    case "fr":
      return "French";
    case "de":
      return "German";
    case "ru":
      return "Russian";
    // case "es":
    //   return "Spanish";
    case "sv":
      return "Swedish";
    // case "zh":
    //   return "Chinese";
    default:
      return "English";
  }
};
