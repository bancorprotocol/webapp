<template>
  <div class="px-4 pt-4">
    <b-row>
      <b-col xl="6">
        <sub-content-block :title="$t('available_claim')">
          <claim-bnt
            v-for="item in available"
            :key="item.id"
            :item="item"
            @click="onClick"
          />
          <div v-if="!available.length" class="no-claim-results">
            {{ `${$t("bnt_to_claim")}.` }}
          </div>
        </sub-content-block>
      </b-col>
      <b-col xl="6">
        <sub-content-block :title="$t('locked')">
          <claim-bnt
            v-for="item in locked"
            @refresh="refresh"
            :key="item.id"
            :item="item"
            @click="onClick"
          />
          <div v-if="!locked.length" class="no-claim-results">
            {{ `${$t("bnt_locked")}.` }}
          </div>
        </sub-content-block>
      </b-col>
    </b-row>

    <modal-tx-action :title="$t('claim_bnt')" icon="coins" :tx-meta="txMeta" />
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import SubContentBlock from "@/components/common/SubContentBlock.vue";
import ClaimBnt from "@/components/protection/ClaimBnt.vue";
import { vxm } from "@/store";
import MainButton from "@/components/common/Button.vue";
import BaseTxAction from "@/components/BaseTxAction.vue";
import ModalTxAction from "@/components/modals/ModalTxAction.vue";

@Component({
  components: {
    ModalTxAction,
    ClaimBnt,
    SubContentBlock,
    MainButton
  }
})
export default class Claim extends BaseTxAction {
  @Prop({ default: "" }) search!: string;

  now = Date.now() / 1000;

  get available() {
    return vxm.ethBancor.availableBalances;
  }

  get locked() {
    return vxm.ethBancor.lockedBalances;
  }

  async onClick() {
    // @ts-ignore
    this.openModal();

    if (this.txMeta.txBusy) return;
    this.txMeta.txBusy = true;

    try {
      // @ts-ignore
      this.txMeta.success = await vxm.ethBancor.claimBnt(this.onPrompt);
    } catch (err) {
      this.txMeta.txBusy = err.message;
    } finally {
      this.txMeta.txBusy = false;
    }
  }

  async refresh() {
    await vxm.ethBancor.fetchAndSetLockedBalances();
    this.$forceUpdate();
  }

  created() {
    setInterval(() => {
      this.now = Date.now() / 1000;
    }, 1000);
  }
}
</script>

<style lang="scss">
.no-claim-results {
  display: flex;
  justify-content: center;
  padding: 25px 10px;
}
</style>
