import { shallowMount, createLocalVue } from "@vue/test-utils";
import SimpleCompWithVuex from "@/components/test/SimpleCompWithVuex.vue";
import Vuex from 'vuex';

describe("Progress Bar Component", () => {
  let state: any;
  let actions: any;
  let mutations: any;
  let getters: any;
  let store: any;

  const localVue = createLocalVue();
  localVue.use(Vuex);

  beforeEach(() => {
    state = {
      darkMode: false,
      countryCode: 'KOR'
    }
    actions = {
      getUserCountry: jest.fn()
    }
    mutations = {
      toggleDarkMode: jest.fn()
    }
    getters = {
      isCountryBanned: () => false
    }
    store = new Vuex.Store({
      modules: {
        general: {
          namespaced: true,
          state,
          actions,
          mutations,
          getters
        }
      }
    });
  })
    
  it("renders props, when passed", () => {    
    const msg = "Test"
    const wrapper = shallowMount(SimpleCompWithVuex, {
      propsData: {
        msg
      },
      store,
      localVue
    });
    expect(wrapper.find('.prop-div').exists()).toBe(true);
    expect(wrapper.find('.prop-div').text()).toContain(msg);    
  })

  it('calls store mutation "toggleDarkMode" when button as toggleDarkMode is clicked', () => {
    const wrapper = shallowMount(SimpleCompWithVuex, {
      store,
      localVue
    });
    wrapper.find('.btn-toggle').trigger('click');
    expect(mutations.toggleDarkMode).toHaveBeenCalled();
  })

  it('dispatches "getUserCountry" when input event value is "input"', () => {
    const wrapper = shallowMount(SimpleCompWithVuex, {
      store,
      localVue
    });
    const input = wrapper.find('input');
    input.trigger('input');
    expect(actions.getUserCountry).toHaveBeenCalled();
  })

  it('renders "store.getters.isCountryBanned" in first p tag', () => {
    const wrapper = shallowMount(SimpleCompWithVuex, {
      store,
      localVue
    });
    const p = wrapper.find('p');
    expect(p.text()).toBe(getters.isCountryBanned().toString());
  })

  it('renders "store.state.darkMode" in second p tag', () => {
    const wrapper = shallowMount(SimpleCompWithVuex, {
      store,
      localVue
    });
    const p = wrapper.findAll('p').at(1);
    expect(p.text()).toBe(state.darkMode.toString());
  })

  it('renders "store.state.countryCode" in third p tag', () => {
    const wrapper = shallowMount(SimpleCompWithVuex, {
      store,
      localVue
    });
    const p = wrapper.findAll('p').at(2);
    expect(p.text()).toBe(state.countryCode.toString());
  })

});
