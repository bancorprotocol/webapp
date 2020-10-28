import { createModule, mutation, action } from "vuex-class-component";
import i18n from "@/i18n";
import { getCountryCode } from "@/api/helpers";

const BandChain = require("@bandprotocol/bandchain.js");

const VuexModule = createModule({
  strict: false
});

export class GeneralModule extends VuexModule.With({ namespaced: "general/" }) {
  language: string = "en";
  darkMode: boolean = false;
  countryCode: string = "";
  currency: string = "USD";
  conversionRates: any = {};
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

  supportedCurrencies: string[] = [
    "USD",
    "CNY",
    "EUR",
    "GBP",
    "KRW",
    "JPY",
    "INR",
    "RUB",
    "CHF",
    "AUD",
    "BRL",
    "CAD",
    "HKD",
    "SGD"
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

  @action async getConversionRates() {
    const bandchain = new BandChain("https://poa-api.bandchain.org");
    let queryPairs: any = [];
    this.supportedCurrencies.map(currency => {
      queryPairs.push("USD/" + currency);
    });
    const tempRate = await bandchain.getReferenceData(queryPairs);
    const rates = tempRate.reduce((a: any, e: any) => {
      let base = e["pair"].split("/")[1];
      delete e.pair;
      a[base] = { ...e };
      return { ...a };
    }, {});
    this.setConversionRates(rates);
  }

  @mutation setCountryCode(countryCode: string) {
    this.countryCode = countryCode;
  }

  @mutation setConversionRates(rates: Number[]) {
    this.conversionRates = rates;
  }

  @mutation setCurrency(currency: string) {
    console.log("new currency: " + currency);

    this.currency = currency;
    console.log("selected currency: " + this.currency);
  }

  @mutation toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem("darkMode", this.darkMode.toString());
  }

  @mutation setLanguage(lang?: string) {
    if (lang) {
      this.language = i18n.locale = lang;
      localStorage.setItem("language", lang);
    } else {
      const userLang: string | null = localStorage.getItem("language");
      if (userLang) {
        this.language = i18n.locale = userLang;
      } else {
        const browserLang = navigator.language.split("-")[0];
        this.language = i18n.locale = browserLang;
        localStorage.setItem("language", browserLang);
      }
    }
  }
}
