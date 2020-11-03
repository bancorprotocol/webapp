import RelayFeeAdjuster from "@/components/common/RelayFeeAdjuster";
import { BFormSpinbutton } from "bootstrap-vue";
import { mount } from "@vue/test-utils";

const wrapper = mount(RelayFeeAdjuster, {
  components: { BFormSpinbutton },
  propsData: {
    fee: 0
  }
});

describe("Relay Fee Adjuster", () => {
  test("component emits event based on prop change", async () => {
    wrapper.setProps({ fee: 0.2 });

    await wrapper.vm.$nextTick();

    const emitted = wrapper.emitted();
    const updateFeeEvents = emitted["update:fee"];

    expect(updateFeeEvents).toHaveLength(1);
    expect(updateFeeEvents[0][0]).toBe(0.2);
  });

  test("component emits new event when incrementing", async () => {
    const $increment = wrapper.find('[aria-label="Increment"]');
    await $increment.trigger("touchstart");
    await $increment.trigger("touchend");

    const emitted = wrapper.emitted();
    const updateFeeEvents = emitted["update:fee"];
    expect(updateFeeEvents).toHaveLength(2);
  });

  test("component will decrement", async () => {
    const $decrement = wrapper.find('[aria-label="Decrement"]');
    const emitted = wrapper.emitted();

    const lastEmitted =
      emitted["update:fee"][emitted["update:fee"].length - 1][0];

    await $decrement.trigger("touchstart");
    await $decrement.trigger("touchend");

    const newEmits = wrapper.emitted();
    const newLastEmitted =
      newEmits["update:fee"][emitted["update:fee"].length - 1][0];

    expect(newLastEmitted).not.toBe(lastEmitted);
    expect(newLastEmitted).toBeCloseTo(lastEmitted - 0.1);
  });
});
