import { mount, createLocalVue } from '@vue/test-utils';
import PoolActionsAddComp from '@/components/test/PoolActionsAddV1.vue';
import flushPromises from 'flush-promises'
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

  const relay = {"id":"0x1aCE5DD13Ba14CA42695A905526f2ec366720b13","version":41,"reserves":[{"id":"0xF35cCfbcE1228014F66809EDaFCDB836BFE388f5","reserveWeight":0.5,"reserveId":"0x1aCE5DD13Ba14CA42695A905526f2ec366720b130xF35cCfbcE1228014F66809EDaFCDB836BFE388f5","logo":["https://ropsten.etherscan.io/images/main/empty-token.png"],"symbol":"BNT","contract":"0xF35cCfbcE1228014F66809EDaFCDB836BFE388f5","smartTokenSymbol":"0x1aCE5DD13Ba14CA42695A905526f2ec366720b13"},{"id":"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","reserveWeight":0.5,"reserveId":"0x1aCE5DD13Ba14CA42695A905526f2ec366720b130xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","logo":["https://ropsten.etherscan.io/images/main/empty-token.png"],"symbol":"ETH","contract":"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","smartTokenSymbol":"0x1aCE5DD13Ba14CA42695A905526f2ec366720b13"}],"fee":0.001,"liqDepth":4054.2175359446505,"owner":"0xc8021b971e69e60C5Deede19528B33dCD52cDbd8","symbol":"ETH","addLiquiditySupported":true,"removeLiquiditySupported":true,"liquidityProtection":true,"whitelisted":true,"focusAvailable":true,"v2":false,"apr":"0.001352","aprMiningRewards":{"poolId":"0x1aCE5DD13Ba14CA42695A905526f2ec366720b13","endTime":1612815300,"rewards":[{"address":"0xF35cCfbcE1228014F66809EDaFCDB836BFE388f5","amount":"231159864794590895968","symbol":"BNT","reward":1574.667818409788},{"address":"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","amount":"6056802050432771057","symbol":"ETH","reward":856.9767250672037}]}}

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
  it('dispatches "calculateOpposingDeposit" when initialized', () => {
    const wrapper = mount(PoolActionsAddComp, {
      propsData: { pool: relay },
      data: () =>({
        balance1: '0.000291',
        balance2: '0.8931'
      }),
      store,
      localVue
    });
    
    expect(actions.calculateOpposingDeposit).toHaveBeenCalled();
  })

  it('renders balance1 and balance2 when initialized', () => {
    const balance1 = '0.000291';
    const balance2 = '0.8931';
    const wrapper = mount(PoolActionsAddComp, {
      propsData: { pool: relay },
      data: () =>({
        balance1,
        balance2
      }),
      store,
      localVue
    });

    expect(wrapper.find('#balance1').exists()).toBe(true);
    expect(wrapper.find('#balance2').exists()).toBe(true);    
    expect(wrapper.find('#balance1').text()).toBe(balance1);
    expect(wrapper.find('#balance2').text()).toBe(balance2);
  })

  it('displays reserveOneId and reserveTwoId from pool', () => {
    const wrapper = mount(PoolActionsAddComp, {
      propsData: { pool: relay },
      data: () =>({
        balance1: '0.000291',
        balance2: '0.8931'
      }),
      store,
      localVue
    });
    
    expect(wrapper.find('#reserve1').exists()).toBe(true);
    expect(wrapper.find('#reserve2').exists()).toBe(true);
    expect(wrapper.find('#reserve1').text()).toBe(relay.reserves[0].id);
    expect(wrapper.find('#reserve2').text()).toBe(relay.reserves[1].id);
  })

  it('dispatches "calculateOpposingDeposit" when token input is changed', () => {
    const wrapper = mount(PoolActionsAddComp, {
      propsData: { pool: relay },
      data: () =>({
        balance1: '0.000291',
        balance2: '0.8931'
      }),
      store,
      localVue
    });

    wrapper.find('#ipAmt1').setValue('0.001');
    wrapper.find('#ipAmt1').trigger('input');

    wrapper.find('#ipAmt2').setValue('0.002');
    wrapper.find('#ipAmt2').trigger('input');

    expect(actions.calculateOpposingDeposit).toHaveBeenCalled();
    expect(actions.calculateOpposingDeposit).toHaveBeenCalledTimes(3);
  })

  it('raised error as "raiseToken1InsufficientBalance" if balance1 is lower than tokenAmount', async () => {
    const balance1 = '0.00291';
    const balance2 = '0.8931';
    const wrapper = mount(PoolActionsAddComp, {
      propsData: { pool: relay },
      data: () =>({
        balance1,
        balance2
      }),
      store,
      localVue
    });
    
    wrapper.find('#ipAmt1').setValue('0.1');
    wrapper.find('#ipAmt1').trigger('input');

    await flushPromises()
    
    expect(wrapper.find('#error1').exists()).toBe(true);
    expect(wrapper.find('#error1').text()).toBe("Insufficient balance");
  })

  it('raised error as "raiseToken2InsufficientBalance" if balance2 is lower than tokenAmount', async () => {
    const balance1 = '0.00291';
    const balance2 = '0.8931';
    const wrapper = mount(PoolActionsAddComp, {
      propsData: { pool: relay },
      data: () =>({
        balance1,
        balance2
      }),
      store,
      localVue
    });
    
    wrapper.find('#ipAmt2').setValue('1');
    wrapper.find('#ipAmt2').trigger('input');

    await flushPromises()
    
    expect(wrapper.find('#error2').exists()).toBe(true);
    expect(wrapper.find('#error2').text()).toBe("Insufficient balance");
  })

})
