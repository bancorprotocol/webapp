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
          Waiting for Confirmation
        </h3>
        <h6 :class="darkMode ? 'text-body-dark' : 'text-body-light'">
          {{ stepDescription }}
        </h6>
      </div>
      <h6 v-else-if="error && !success" class="text-danger">
        <h3 :class="darkMode ? 'text-body-dark' : 'text-body-light'">
          Transaction Failed
        </h3>
        Error: {{ error }}
      </h6>
      <h6 v-else-if="!error && success">
        <h3 :class="darkMode ? 'text-body-dark' : 'text-body-light'">
          Transaction Submitted
        </h3>
        <a
          :href="success.blockExplorerLink"
          target="_blank"
          class="text-primary"
        >
          View TX Details for ID {{ success.txId.substring(0, 6) }} on
          {{ explorerName }}.
        </a>
      </h6>
    </b-col>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue, PropSync, Emit } from "vue-property-decorator";
import { vxm } from "@/store";
import { namespace } from "vuex-class";
import { TxResponse } from "@/types/bancor";

const bancor = namespace("bancor");

@Component
export default class ActionModalStatus extends Vue {
  @bancor.Getter currentNetwork!: string;

  @Prop() error?: string;
  @Prop() success?: TxResponse | null;
  @Prop({ default: "Wait for your Wallet to prompt and continue there" })
  stepDescription!: string;

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

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss" scoped></style>
