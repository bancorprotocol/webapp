<template>
  <content-block class="mb-3">
    <template slot="header">
      <pool-actions-header title="Create a Pool" />
    </template>

    <div class="mt-3">
      <label-content-split label="Pool Type">
        <b-badge variant="primary" size="sm" class="px-2">V1</b-badge>
      </label-content-split>

      <alert-block
        class="mt-3"
        variant="info"
        msg="In Bancor V1 total reserve of the pool you create should be less or equal 100%."
      />

      <token-input-field
        class="mt-3"
        label="Input"
        :amount.sync="amount1"
        :token="token1"
        :balance="balance1"
        name="token1"
        :error-msg="errorToken1"
      />

      <token-input-field
        class="mt-3"
        label="Input"
        :amount.sync="amount2"
        :token="token2"
        :balance="balance2"
        :dropdown="true"
        name="token2"
        v-on:open-swap-modal="openModal"
        :error-msg="errorToken2"
      />

      <main-button
        class="mt-4"
        @click.native="initConvert"
        label="Create a Pool"
        :active="true"
        :large="true"
        :loading="false"
        :disabled="false"
      />

      <modal-select-token name="token2" v-on:select-token="selectToken" />
      <modal-create-action
        :token1="token1"
        :token2="token2"
        :amount1="amount1"
        :amount2="amount2"
      />
    </div>
  </content-block>
</template>

<script lang="ts">
import { Watch, Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import PoolActionsHeader from "@/components/pool/PoolActionsHeader.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";
import TokenInputField from "@/components/common/TokenInputField.vue";
import { ViewToken, TxResponse, Step } from "@/types/bancor";
import ModalSelectToken from "@/components/modals/ModalSelectToken.vue";
import MainButton from "@/components/common/Button.vue";
import ModalCreateAction from "@/components/pool/create/ModalCreateAction.vue"

@Component({
  components: {
    ModalSelectToken,
    TokenInputField,
    AlertBlock,
    LabelContentSplit,
    PoolActionsHeader,
    ContentBlock,
    MainButton,
    ModalCreateAction
  }
})
export default class CreateHome extends Vue {
  amount1 = "";
  amount2 = "";

  token1: ViewToken = vxm.bancor.token(vxm.bancor.newNetworkTokenChoices[0].id);
  token2: ViewToken = vxm.bancor.tokens[1];

  errorToken1 = "";
  errorToken2 = "";

  fee = 0
  txBusy = false;
  success: TxResponse | string | null = null;
  error = "";
  sections: Step[] = [];
  stepIndex = 0;

  get balance1() {
    return vxm.bancor.token(this.token1.id).balance ?? "0";
  }

  get balance2() {
    return vxm.bancor.token(this.token2.id).balance ?? "0";
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  get isAuthenticated() {
    return vxm.wallet.isAuthenticated;
  }

  async initConvert() {
    if (this.isAuthenticated) this.$bvModal.show("modal-create-action");
    //@ts-ignore
    else await this.promptAuth();
  }

  openModal(name: string) {
    this.$bvModal.show(name);
  }

  selectToken(token: { token: ViewToken, name: string }): void {
    if (token.name === "token1") this.token1 = token.token
    else this.token2 = token.token
    this.$bvModal.hide(token.name);
  }
  created() {}
}
</script>

<style scoped lang="scss"></style>
