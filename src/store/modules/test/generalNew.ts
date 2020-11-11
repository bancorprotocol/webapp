// import { Module, GetterTree, MutationTree, ActionTree } from 'vuex'
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

// import i18n from "@/i18n";
import { getCountryCode } from "@/api/helpers";

@Module({namespaced: true})
export default class GeneralNewModule extends VuexModule {
  public language: string = "en";
  public darkMode: boolean = false;
  public countryCode: string = "";
  public bannedCountries: string[] = [
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

  @Action({ commit: 'setCountryCode' })
  async getUserCountry() {    
    const countryCode = await getCountryCode();
    return countryCode;
  }

  @Mutation setCountryCode(countryCode: string) {
    this.countryCode = countryCode;    
  }

  @Mutation toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem("darkMode", this.darkMode.toString());
  }
}


/* try it only using with vuex lib */
// export class GeneralNew {
//   public language: string = "en";
//   public darkMode: boolean = false;
//   public countryCode: string = "";
//   public bannedCountries: string[] = [
//     "BLR",
//     "BDI",
//     "CAF",
//     "COG",
//     "PRK",
//     "GIN",
//     "GNB",
//     "IRN",
//     "IRQ",
//     "LBN",
//     "LBY",
//     "MLI",
//     "MMR",
//     "SSD",
//     "SOM",
//     "SDN",
//     "SYR",
//     "VEN",
//     "YEM",
//     "ZWE"
//   ];
// }

// const getters: GetterTree<GeneralNew, any> = {
//   isCountryBanned(state, getters) {
//     return state.bannedCountries.some(
//       (code: string) => state.countryCode === code
//     );
//   }
// }

// const mutations: MutationTree<GeneralNew> = {
//   setCountryCode(state, countryCode: string) {
//     state.countryCode = countryCode;
//   },
//   toggleDarkMode(state) {
//     state.darkMode = !state.darkMode;
//     localStorage.setItem("darkMode", state.darkMode.toString());
//   }  
// }

// const actions: ActionTree<GeneralNew, any> = {
//   async getUserCountry(state) {
//     const countryCode = await getCountryCode();
//     state.commit('setCountryCode', countryCode);
//   }
// }

// const GeneralNewModule: Module<GeneralNew, any> = {
//   namespaced: true,
//   state: new GeneralNew(),
//   getters,
//   mutations,
//   actions
// };

// export default GeneralNewModule;

