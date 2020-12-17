<template>
  <div>
    <div
      v-for="(item, index) in content"
      :key="index"
      class="protected-stake d-lg-flex justify-content-lg-between align-items-lg-center p-3 my-3"
      :class="darkMode ? 'protected-stake-dark' : 'protected-stake'"
    >
      <div class="d-flex flex-column">
        <router-link :to="{ name: item.route }" class="font-w600 font-size-16">
          {{ item.linkText }}
        </router-link>
        <span class="mt-1">
          {{ item.description }}
        </span>
      </div>
      <b-btn
        :to="{ name: item.route }"
        variant="primary"
        class="stake-button mt-3 mt-lg-0"
      >
        {{ item.buttonText }}
      </b-btn>
    </div>
  </div>
</template>

<script lang="ts">
import BaseComponent from "@/components/BaseComponent.vue";

export default class ProtectedEmpty extends BaseComponent {
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
