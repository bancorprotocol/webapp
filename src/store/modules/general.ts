import { createModule, mutation, action } from "vuex-class-component";
import { i18n } from "@/i18n";

const VuexModule = createModule({
  strict: false
});

export class GeneralModule extends VuexModule.With({ namespaced: "general/" }) {
  language: string = "en";
  darkMode: boolean = false;

  @mutation setLocale(locale: string) {
    i18n.locale = locale;
    localStorage.setItem("locale", locale);
  }

  @mutation toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem("darkMode", this.darkMode.toString());
  }
}
