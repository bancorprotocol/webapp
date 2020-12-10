import { shallowMount, createLocalVue } from "@vue/test-utils";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import Vuex from "vuex";
import numeral from "numeral";

describe("LabelContentSplit.vue", () => {
  let state: any;  
  let store: any;

  const localVue = createLocalVue();
  localVue.use(Vuex);  

  beforeEach(() => {
    state = {
      darkMode: false,      
    }    
    store = new Vuex.Store({
      modules: {
        general: {
          namespaced: true,
          state          
        }
      }
    });
  })

  it("renders props when passed", () => {
    const label = "Price Impact";
    const value = numeral(0.03).format('0.0000%');
    const wrapper = shallowMount(LabelContentSplit, {
      propsData: { label, value },
      store,
      localVue
    });
    expect(wrapper.text()).toMatch(label);
    expect(wrapper.text()).toMatch(value);
  });

  it("displays tooltip icon and popover when passed", () => {
    const tooltip = "Tooltip";
    const wrapper = shallowMount(LabelContentSplit, {
      propsData: { tooltip },
      store,
      localVue
    });
    expect(wrapper.find('#popover-target').exists()).toBe(true);
    expect(wrapper.text()).toMatch(tooltip);
  });

  it("should not displays value while loading", () => {
    const value = numeral(0.03).format('0.0000%');
    const wrapper = shallowMount(LabelContentSplit, {
      propsData: { value, loading: true },
      store,
      localVue
    });    
    expect(wrapper.text()).not.toMatch(value);
  })

  it("displays red text when isAlert prop has passed", () => {
    const value = numeral(0.03).format('0.0000%');
    const wrapper = shallowMount(LabelContentSplit, {
      propsData: { value, isAlert: true },
      store,
      localVue
    });
    const span = wrapper.findAll('span').at(1);
    expect(span.text()).toBe(value);
    expect(span.element.classList.contains('text-red')).toBe(true);    
  })

});
