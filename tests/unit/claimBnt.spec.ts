import { shallowMount, createLocalVue } from "@vue/test-utils";
import ClaimBnt from "@/components/protection/ClaimBnt.vue";
import Vuex from 'vuex';
import dayjs from "@/utils/dayjs"

describe('ClaimBnt.vue', () => {
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
    }
    mutations = {
    }
    getters = {
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

  afterEach(() => {
    jest.clearAllTimers();
  });

   /* check props */
  it("shows timer, when time left", () => {    
    const item = {
      id: '1',
      amount: 100,
      lockedUntil: (Date.now()+10000) / 1000,
      usdValue: 10
    }
    const wrapper = shallowMount(ClaimBnt, {
      propsData: {
        item
      },
      store,
      localVue
    });
    expect(wrapper.find('.amt-num').exists()).toBe(true);
    expect(wrapper.find('.time-left').exists()).toBe(true);
    expect(wrapper.find('.btn-claim').exists()).toBe(false);
  })

  it("hide timer, after unlock time period", () => {    
    const item = {
      id: '1',
      amount: 100,
      lockedUntil: (Date.now()-10000) / 1000,
      usdValue: 10
    }
    const wrapper = shallowMount(ClaimBnt, {
      propsData: {
        item
      },
      store,
      localVue
    });
    expect(wrapper.find('.time-left').exists()).toBe(false);
    expect(wrapper.find('.btn-claim').exists()).toBe(true);
  })

  it('should unlock after locking period', () => {
    jest.useFakeTimers();

    const item = {
      id: '1',
      amount: 100,
      lockedUntil: (Date.now()+2000) / 1000,
      usdValue: 10
    }
    const wrapper = shallowMount(ClaimBnt, {
      propsData: {
        item
      },
      store,
      localVue
    });

    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);

    jest.advanceTimersByTime(2200);

    // should be unlocked
    expect(wrapper.find('.time-left').exists()).toBe(true);
    expect(wrapper.find('.btn-claim').exists()).toBe(false);
  })

})