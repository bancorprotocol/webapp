import { shallowMount, mount } from '@vue/test-utils';
import TableComp from '@/components/test/TableComp.vue';

describe('TableComp.vue', () => {
    /* check property */
    it('renders props.items when passed', () => {
      const items = [{
        id: 1,
        name: 'test',
        result: 'Assigned',
        totalVotesFor: 20,
        totalVotesAgainst: 15
      }, {
        id: 2,
        name: 'test2',
        result: 'Assigned',
        totalVotesFor: 10,
        totalVotesAgainst: 5
      }]
      const wrapper = shallowMount(TableComp, {
        propsData: { items }
      });

      expect(wrapper.find('#r1-1').exists()).toBe(true);
      expect(wrapper.findAll('tr').length).toBe(2);
      expect(wrapper.findAll('#r1-1 > td').at(1).text()).toBe('test');
      expect(wrapper.findAll('#r1-1 > td').at(2).text()).toBe('Assigned');
      expect(wrapper.findAll('#r1-1 > td').at(3).text()).toBe('20');
      expect(wrapper.findAll('#r1-1 > td').at(4).text()).toBe('15');    
    })

    /* check div && css */
    it('displays same width what we want', () => {
      const items = [{
        id: 1,
        name: 'test',
        result: 'Assigned',
        totalVotesFor: 20,
        totalVotesAgainst: 15
      }]
      const wrapper = shallowMount(TableComp, {
        propsData: { items }
      });
      
      expect(wrapper.find('#r1-1').exists()).toBe(true);
      expect(wrapper.findAll('#r1-1 > td').at(1).element.style.width).toBe('120px');
    })
   
    // /* check emitted event */
    it('check to receive event when custom event is emitted', async () => {
      const items = [{
        id: 2,
        name: 'test',
        result: 'Assigned',
        totalVotesFor: 20,
        totalVotesAgainst: 15
      }]
      const wrapper = shallowMount(TableComp, {
        propsData: { items }
      });
      await wrapper.vm.$emit('click')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.emitted().click).toBeTruthy();
      expect(wrapper.emitted().click?.length).toBe(1);
      
      wrapper.findAll('#r1-2 > td > button').at(0).trigger('click');      
      const itemId = items[0].id;
      expect(wrapper.emitted('click')?.flat().toString()).toBe(`${itemId},${itemId}`);
      expect(wrapper.emitted().click?.length).toBe(2);
    })
  
  })
  

