import { mount, createLocalVue } from "@vue/test-utils";
import ProgressBar from "@/components/common/ProgressBar.vue";
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

describe("Progress Bar Component", () => {
  let actions
  let store: any

  beforeEach(() => {
    actions = {        
    }
    store = new Vuex.Store({})
  })
    
  it("renderes props. when passed", () => {
    
    const percentage = 20
    const wrapper = mount(ProgressBar, {
      propsData: {
        percentage
      },
      store,
      localVue
    });    
    expect(wrapper.find('.progress-line-bar__progress').exists()).toBe(true)
    // expect(wrapper.find('.progress-line-bar__progress')[0].style.width)
  })
});
