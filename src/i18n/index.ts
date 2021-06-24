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
import zh from "./zh.json";
import ar from "./ar.json";
import cs from "./cs.json";
import fi from "./fi.json";
import el from "./el.json";
import hu from "./hu.json";
import it from "./it.json";
import ja from "./ja.json";
import ko from "./ko.json";
import no from "./no.json";
import tr from "./tr.json";

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
  sv,
  zh,
  ar,
  cs,
  fi,
  el,
  hu,
  it,
  ja,
  ko,
  no,
  tr
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
    case "es":
      return "Español";
    case "sv":
      return "Svenska";
    case "zh":
      return "中文";
    case "ar":
      return "العربية";
    case "cs":
      return "čeština";
    case "fi":
      return "Suomi";
    case "el":
      return "ελληνικά";
    case "hu":
      return "magyar";
    case "it":
      return "Italiano";
    case "ja":
      return "日本語";
    case "ko":
      return "한국어";
    case "no":
      return "Norsk";
    case "tr":
      return "Türkçe";
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
    case "es":
      return "Spanish";
    case "sv":
      return "Swedish";
    case "zh":
      return "Chinese";
    case "ar":
      return "Arabic";
    case "cs":
      return "Czech";
    case "fi":
      return "Finnish";
    case "el":
      return "Greek";
    case "hu":
      return "Hungarian";
    case "it":
      return "Italian";
    case "ja":
      return "Japanese";
    case "ko":
      return "Korean";
    case "no":
      return "Norwegian";
    case "tr":
      return "Turkish";
    default:
      return "English";
  }
};
