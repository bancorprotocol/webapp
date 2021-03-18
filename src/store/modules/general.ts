import { createModule, mutation, action } from "vuex-class-component";
import { i18n } from "@/i18n";

const VuexModule = createModule({
  strict: false
});

export class GeneralModule extends VuexModule.With({ namespaced: "general/" }) {
  language: string = "en";
  darkMode: boolean = false;
  adminMode: boolean = false;

  @mutation setLocale(locale: string) {
    i18n.locale = locale;
    localStorage.setItem("locale", locale);
  }

  @mutation toggleDarkMode() {
    const newStatus = !this.darkMode;
    this.darkMode = newStatus;
    localStorage.setItem("darkMode", newStatus.toString());
  }

  @mutation toggleAdminMode() {
    const newStatus = !this.adminMode;
    this.adminMode = newStatus;
    localStorage.setItem("adminMode", newStatus.toString());
  }
}
