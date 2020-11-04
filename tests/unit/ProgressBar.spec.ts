import ProgressBar from "@/components/common/ProgressBar.vue";
import { shallowMount } from "@vue/test-utils";

describe("Progress Bar Component", () => {
  it("renderes props. when passed", () => {
    const percentage = 20  
    const wrapper = shallowMount(ProgressBar, {  
      propsData: {
        percentage
      }
    });
    console.log('d', wrapper.find('.progress-line-bar__progress'))
    // expect(wrapper.find('.progress-line-bar__progress')[0].style.width)
  })
});
