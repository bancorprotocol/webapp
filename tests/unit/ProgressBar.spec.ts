import {mount, createLocalVue} from "@vue/test-utils";
import TestProgressBar from "@/components/deprecated/TestProgressBar.vue";
import Vuex from "vuex";

// jest.mock("../../src/router/index.ts", () => jest.fn());

describe("Progress Bar Component", () => {
  let state;
  let actions;
  let mutations;
  let getters;
  let store: any;

  const localVue = createLocalVue();
  localVue.use(Vuex);

  beforeEach(() => {
    (state = {
      darkMode: false,
      countryCode: "KOR"
    }),
      (actions = {
        getUserCountry: jest.fn()
      }),
      (mutations = {
        toggleDarkMode: jest.fn()
      }),
      (getters = {
        isCountryBanned: () => false
      }),
      (store = new Vuex.Store({
        modules: {
          GeneralNewModule: {
            namespaced: true,
            state,
            actions,
            mutations,
            getters
          }
        }
      }));
  });

  it("renderes props. when passed", () => {
    const percentage = 20;
    const wrapper = mount(TestProgressBar, {
      propsData: {
        percentage
      },
      store,
      localVue
    });
    expect(wrapper.find(".progress-line-bar__progress").exists()).toBe(true);
    // expect(wrapper.find('.progress-line-bar__progress').style.width)
  });
});
