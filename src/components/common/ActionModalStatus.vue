<template>
  <div>
    <b-col md="12" class="text-center my-4 text-primary">
      <font-awesome-icon
        v-if="!success && !error"
        size="3x"
        icon="circle-notch"
        spin
      />
      <font-awesome-icon
        v-else-if="error && !success"
        icon="exclamation-triangle"
        class="text-danger"
        size="3x"
      />
      <font-awesome-icon
        v-else-if="!error && success"
        icon="check-circle"
        class="text-success"
        size="3x"
      />
    </b-col>
    <b-col cols="12" class="text-center">
      <div v-if="!success && !error">
        <h3 :class="darkMode ? 'text-body-dark' : 'text-body-light'">
          {{ $t("waiting_for_confirmation") }}
        </h3>
        <h6 :class="darkMode ? 'text-body-dark' : 'text-body-light'">
          {{ stepDescription }}
        </h6>
      </div>
      <h6 v-else-if="error && !success" class="text-danger">
        <h3 :class="darkMode ? 'text-body-dark' : 'text-body-light'">
          {{ $t("transaction_failed") }}
        </h3>
        {{ `${$t("error")} ${error}` }}
      </h6>
      <h6 v-else-if="!error && success">
        <h3 :class="darkMode ? 'text-body-dark' : 'text-body-light'">
          {{ $t("transaction_submitted") }}
        </h3>
        <a
          :href="success.blockExplorerLink"
          target="_blank"
          :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
        >
          {{
            $t("tx_details", {
              id: success.txId.substring(0, 6),
              explorerName: explorerName
            })
          }}
        </a>
        <div
          v-if="msg"
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
        >
          {{ msg }}
        </div>
      </h6>
    </b-col>
  </div>
</template>

<script lang="ts">
import { Prop, Component } from "vue-property-decorator";
import { TxResponse } from "@/types/bancor";
import { i18n } from "@/i18n";
import BaseComponent from "@/components/BaseComponent.vue";

@Component
export default class ActionModalStatus extends BaseComponent {
  @Prop() error?: string;
  @Prop() success?: TxResponse | null;
  @Prop({ default: i18n.t("wait_for_wallet") })
  stepDescription!: string;
  @Prop()
  msg?: string;

  get explorerName() {
    switch (this.currentNetwork) {
      case "eos":
        return `EOSX.io`;
      case "eth":
        return `Etherscan`;
      default:
        return `Block Explorer`;
    }
  }
}
</script>

<style lang="scss" scoped></style>
