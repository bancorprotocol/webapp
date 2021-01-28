<template>
  <b-modal
    :content-class="darkMode ? 'bg-block-dark' : 'bg-block-light'"
    scrollable
    size="sm"
    centered
    v-model="show"
    hide-footer
    @close="onHide"
    @cancel="onHide"
    @hide="onHide"
    @show="update"
  >
    <template slot="modal-header">
      <div class="w-100">
        <b-row>
          <b-col cols="12" class="d-flex justify-content-between mb-2">
            <span
              class="font-size-14 font-w600"
              :class="darkMode ? 'text-dark' : 'text-light'"
            >
            </span>
            <font-awesome-icon
              class="cursor font-size-lg"
              :class="darkMode ? 'text-dark' : 'text-light'"
              @click="onHide"
              icon="times"
            />
          </b-col>
        </b-row>
      </div>
    </template>

    <div class="text-center" :class="darkMode ? 'text-dark' : 'text-light'">
      <span class="error-icon">
        <font-awesome-icon
          :class="darkMode ? 'text-dark' : 'text-light'"
          icon="times-circle"
        />
      </span>
      <h3
        class="font-size-20 mt-4"
        :class="darkMode ? 'text-dark' : 'text-light'"
      >
        {{ `${$t("insufficient_balance")} ${symbol}` }}
      </h3>
      <div class="font-size-16" :class="darkMode ? 'text-dark' : 'text-light'">
        {{ $t("order_to_vote", { symbol: symbol }) }}
      </div>
      <main-button
        @click="onHide"
        :label="$t('stake')"
        :large="true"
        :active="true"
        :block="true"
        class="font-size-14 font-w400 mt-3"
      />
    </div>
  </b-modal>
</template>

<script lang="ts">
import { vxm } from "@/store/";
import { Component, VModel } from "vue-property-decorator";
import MainButton from "@/components/common/Button.vue";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: {
    MainButton
  }
})
export default class ModalNotEnoughTokens extends BaseComponent {
  @VModel({ type: Boolean }) show!: boolean;

  symbol: string = "";

  onHide() {
    this.show = false;
  }

  async update() {}

  async mounted() {
    this.symbol = await vxm.ethGovernance.getSymbol();
  }
}
</script>
<style lang="scss">
@import "@/assets/_scss/custom/_variables";

.modal-body {
  padding-top: 0 !important;
}

.error-icon svg {
  font-size: 84px;
  color: $text-error-dark !important;
}
</style>
