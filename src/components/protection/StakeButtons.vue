<template>
  <div>
    <gray-border-block
      v-for="option in stakeOptions"
      :key="option.id"
      :class="option.id <= stakeOptions.length ? 'mb-3' : ''"
    >
      <h5
        class="font-size-14 font-w600 text-uppercase my-2"
        :class="darkMode ? 'text-white' : 'text-primary'"
      >
        {{ option.title }}
      </h5>
      <p class="font-size-14 font-w400 mb-3">
        {{ option.desc }}
      </p>
      <main-button
        @click="click(option.id)"
        :label="option.buttonTxt"
        :active="option.buttonActive"
        :large="true"
        :disabled="!option.buttonEnabled"
        class="mb-2 font-size-14"
      />
    </gray-border-block>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import MainButton from "@/components/common/Button.vue";

@Component({
  components: { GrayBorderBlock, MainButton }
})
export default class StakeButtons extends Vue {
  get stakeOptions() {
    return [
      {
        id: 0,
        title: `Single-Sided Protection`,
        desc:
          "Add liquidity with exposure to one token and protect it from impermanent loss.",
        buttonTxt: "Stake and Protect",
        buttonActive: true,
        buttonEnabled: true
      },
      {
        id: 1,
        title: "Dual-Sided Protection",
        desc:
          "Stake pools tokens of any 50/50 pool holding BNT to protect them from impermanent loss.",
        buttonTxt: "Stake and Protect",
        buttonActive: false,
        buttonEnabled: true
      }
    ];
  }

  @Emit("click")
  click(id: number) {
    return id;
  }
}
</script>

<style lang="scss"></style>
