<template>
  <div>
    <div
      v-for="(item, index) in content"
      :key="index"
      class="protected-stake d-flex justify-content-between align-items-center p-3 my-3"
      :class="darkMode ? 'protected-stake-dark' : 'protected-stake'"
    >
      <div>
        <router-link :to="{ name: item.route }" class="font-w600 font-size-16">
          {{ item.linkText }}
        </router-link>
        <span>
          {{ item.description }}
        </span>
      </div>
      <b-btn :to="{ name: item.route }" variant="primary" class="stake-button">
        {{ item.buttonText }}
      </b-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";

@Component
export default class ProtectedEmpty extends Vue {
  content = [
    {
      route: "AddProtectionHome",
      linkText: "Stake your pool tokens for protections.",
      description:
        "Stake pool tokens of any 50/50 pool to protect them from impermanent loss.",
      buttonText: "Stake"
    },
    {
      route: "AddProtectionHome",
      linkText: "Add single liquidity.",
      description:
        "Add liquidity with one reserve, be exposed to it only and protect it from impermanent loss. ",
      buttonText: "Stake"
    }
  ];

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/_scss/custom/variables";

.protected-stake {
  color: $text-color-light;
  font-weight: 500;
  font-size: 14px;
  border-radius: $border-radius;
  background-color: $block-bg-blue;

  .stake-button {
    font-size: 14px;
    font-weight: 500;
    width: 132px;
    padding: 12px 0px 12px 0px;
  }
}

.protected-stake-dark {
  @extend .protected-stake;

  color: $text-color-dark !important;
  background-color: $block-bg-blue-dark !important;
}
</style>
