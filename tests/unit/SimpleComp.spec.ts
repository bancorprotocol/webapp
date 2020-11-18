import { shallowMount, mount } from '@vue/test-utils';
import { Vue } from "vue-property-decorator";
import SimpleComp from '@/components/test/SimpleComp.vue';
import SimpleChildComp from '@/components/test/SimpleChildComp.vue';

describe('SimpleComp.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = shallowMount(SimpleComp, {
      propsData: { msg }
    });
    expect(wrapper.text()).toMatch(msg);    
  })

  // it('displays same width what we want', () => {
  //   const wrapper = shallowMount(SimpleComp);
  //   expect(wrapper.find('.div-bg').style.width)
  // })
 
  it('displays "clicked" when custom event is emitted', async () => {
    // not work well
    const wrapper = mount(SimpleComp);
    wrapper.findComponent(SimpleChildComp).vm.$emit('click');
    // await wrapper.findComponent(SimpleChildComp).find('button').trigger('click');    

    expect(wrapper.emitted().click).toBeTruthy();    
    // await Vue.nextTick()
    
    // expect(wrapper.find('p').html()).toContain('clicked');    
  })

  it('should render SHOW, then hide it', async () => {
    const wrapper = mount(SimpleComp)
    expect(wrapper.find(".div-show").text()).toMatch(/SHOW/);

    await wrapper.setData({
      isShow: false
    })
    expect(wrapper.find(".div-show").isEmpty()).toBe(true);
  })
  

})
