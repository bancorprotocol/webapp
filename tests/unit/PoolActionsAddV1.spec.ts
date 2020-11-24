import { shallowMount, mount } from '@vue/test-utils';
import PoolActionsAddComp from '@/components/test/PoolActionsAddV1.vue';

describe('PoolActionsAddV1.vue', () => {
  /* check property */
//   it('renders props.msg when passed', () => {
//     const msg = 'new message';
//     const wrapper = shallowMount(SimpleComp, {
//       propsData: { msg }
//     });
//     expect(wrapper.text()).toMatch(msg);    
//   })  

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
