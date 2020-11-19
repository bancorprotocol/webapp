import { createModule, mutation, action } from "vuex-class-component";
// import i18n from "@/i18n";
import { getCountryCode } from "@/api/helpers";

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
  }

  @mutation setCountryCode(countryCode: string) {
    this.countryCode = countryCode;
  }

  @mutation toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem("darkMode", this.darkMode.toString());
  }
}
