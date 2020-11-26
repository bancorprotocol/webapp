import { shallowMount } from "@vue/test-utils";
import TestWorld from "@/components/deprecated/TestWorld.vue";

describe("TestWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(TestWorld, {
      propsData: { msg }
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
