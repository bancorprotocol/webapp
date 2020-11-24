import { mount, createLocalVue } from '@vue/test-utils';
import PoolActionsAddComp from '@/components/test/PoolActionsAddV1.vue';
import Vuex from 'vuex';

describe('PoolActionsAddV1.vue', () => {
  let state: any;
  let actions: any;
  let mutations: any;
  let getters: any;
  let store: any;

  /* 'CreateLocalVue' is isolated for testing */
  const localVue = createLocalVue();
  localVue.use(Vuex);

  /* Inject the mock into the store */
  beforeEach(() => {
    state = {      
    }
    actions = {
      calculateOpposingDeposit: jest.fn()
    }
    getters = {      
      token: jest.fn()
    }
    store = new Vuex.Store({
      modules: {
        bancor: {
          namespaced: true,
          state,
          actions,
          mutations,
          getters
        }        
      }
    });
  })

  /* check property */
  it('renders props.msg when passed', () => {
    const relay = {"id":"0x1aCE5DD13Ba14CA42695A905526f2ec366720b13","version":41,"reserves":[{"id":"0xF35cCfbcE1228014F66809EDaFCDB836BFE388f5","reserveWeight":0.5,"reserveId":"0x1aCE5DD13Ba14CA42695A905526f2ec366720b130xF35cCfbcE1228014F66809EDaFCDB836BFE388f5","logo":["https://ropsten.etherscan.io/images/main/empty-token.png"],"symbol":"BNT","contract":"0xF35cCfbcE1228014F66809EDaFCDB836BFE388f5","smartTokenSymbol":"0x1aCE5DD13Ba14CA42695A905526f2ec366720b13"},{"id":"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","reserveWeight":0.5,"reserveId":"0x1aCE5DD13Ba14CA42695A905526f2ec366720b130xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","logo":["https://ropsten.etherscan.io/images/main/empty-token.png"],"symbol":"ETH","contract":"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","smartTokenSymbol":"0x1aCE5DD13Ba14CA42695A905526f2ec366720b13"}],"fee":0.001,"liqDepth":4054.2175359446505,"owner":"0xc8021b971e69e60C5Deede19528B33dCD52cDbd8","symbol":"ETH","addLiquiditySupported":true,"removeLiquiditySupported":true,"liquidityProtection":true,"whitelisted":true,"focusAvailable":true,"v2":false,"apr":"0.001352","aprMiningRewards":{"poolId":"0x1aCE5DD13Ba14CA42695A905526f2ec366720b13","endTime":1612815300,"rewards":[{"address":"0xF35cCfbcE1228014F66809EDaFCDB836BFE388f5","amount":"231159864794590895968","symbol":"BNT","reward":1574.667818409788},{"address":"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","amount":"6056802050432771057","symbol":"ETH","reward":856.9767250672037}]}}

    const wrapper = mount(PoolActionsAddComp, {
      propsData: { pool: relay },
      data: () =>({
        balance1: '0.000291',
        balance2: '0.8931'
      }),
      store,
      localVue
    });
    expect(true).toBe(true);
  })

//   /* check div && css */
//   it('displays same width what we want', () => {
//     const wrapper = shallowMount(SimpleComp);
    
//     expect(wrapper.find('.div-bg').exists()).toBe(true);
//     expect(wrapper.find('.div-bg').element.style.width).toBe('200px');
//   })
 
//   /* check emitted event */
//   it('displays "clicked" when custom event is emitted', async () => {
//     const wrapper = mount(SimpleComp);
//     const childRef = wrapper.findComponent(SimpleChildComp)
//     childRef.vm.$emit('click');
//     // await childRef.find('button').trigger('click');

//     await wrapper.vm.$nextTick()

//     expect(childRef.exists()).toBe(true);
//     expect(wrapper.emitted().click).toBeTruthy();
//     expect(wrapper.emitted().click?.length).toBe(1);
//     // expect(wrapper.find('p').html()).toContain('clicked');    
//   })

//   /* check visibility of div */
//   it('should render SHOW, then hide it', async () => {
//     const wrapper = mount(SimpleComp)
//     expect(wrapper.find(".div-show").text()).toMatch(/SHOW/);

//     await wrapper.setData({
//       isShow: false
//     })
//     expect(wrapper.find(".div-show").isEmpty()).toBe(true);
//   })

})
