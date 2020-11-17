import { shallowMount } from '@vue/test-utils'
import SimpleComp from '@/components/test/SimpleComp.vue'

describe('SimpleComp.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(SimpleComp, {
      propsData: { msg }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
