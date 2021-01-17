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
import { i18n } from "@/i18n";
import { Component } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";

@Component
export default class ProtectedEmpty extends BaseComponent {
  content = [
    {
      route: "AddProtectionHome",
      linkText: i18n.t("stake_pool_tokens"),
      description: i18n.t("stake_pool_tokens_desc"),
      buttonText: i18n.t("stake")
    },
    {
      route: "AddProtectionHome",
      linkText: i18n.t("single_liquidity"),
      description: i18n.t("single_liquidity_desc"),
      buttonText: i18n.t("stake")
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
