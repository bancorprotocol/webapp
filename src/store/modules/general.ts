import { createModule, mutation, action } from "vuex-class-component";
import { getCountryCode } from "@/api/helpers";
import { i18n } from "@/i18n";

const VuexModule = createModule({
  strict: false
});

export class GeneralModule extends VuexModule.With({ namespaced: "general/" }) {
  language: string = "en";
  darkMode: boolean = false;
  countryCode: string = "";
  bannedCountries: string[] = [
    "BLR",
    "BDI",
    "CAF",
    "COG",
    "PRK",
    "GIN",
    "GNB",
    "IRN",
    "IRQ",
    "LBN",
    "LBY",
    "MLI",
    "MMR",
    "SSD",
    "SOM",
    "SDN",
    "SYR",
    "VEN",
    "YEM",
    "ZWE"
  ];

  get isCountryBanned() {
    return this.bannedCountries.some(
      (code: string) => this.countryCode === code
    );
  }

  @action async getUserCountry() {
    const countryCode = await getCountryCode();
    this.setCountryCode(countryCode);
    return countryCode;
  }

  @mutation setCountryCode(countryCode: string) {
    this.countryCode = countryCode;
  }

  @mutation setLocale(locale: string) {
    i18n.locale = locale;
    localStorage.setItem("locale", locale);
  }

  @mutation toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem("darkMode", this.darkMode.toString());
  }
}
