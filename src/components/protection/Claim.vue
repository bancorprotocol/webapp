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
          <claim-bnt v-for="item in locked" :key="item.id" :item="item" />
          <div v-if="!locked.length" class="no-claim-results">
            {{ `${$t("bnt_locked")}.` }}
          </div>
        </sub-content-block>
      </b-col>
    </b-row>

    <modal-base
      :title="`${$t('claim')} BNT`"
      v-model="modal"
      @input="setDefault"
    >
      <action-modal-status :error="error" :success="success" />

      <main-button
        @click="onModalClick"
        class="mt-3"
        :label="modalConfirmButton"
        :active="true"
        :large="true"
        :disabled="txBusy"
      />
    </modal-base>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SubContentBlock from "@/components/common/SubContentBlock.vue";
import ClaimBnt from "@/components/protection/ClaimBnt.vue";
import { vxm } from "@/store";
import { i18n } from "@/i18n";
import ModalBase from "@/components/modals/ModalBase.vue";
import ActionModalStatus from "@/components/common/ActionModalStatus.vue";
import MainButton from "@/components/common/Button.vue";
import { TxResponse } from "@/types/bancor";

@Component({
  components: {
    ActionModalStatus,
    ModalBase,
    ClaimBnt,
    SubContentBlock,
    MainButton
  }
})
export default class Claim extends Vue {
  @Prop({ default: "" }) search!: string;

  modal = false;
  txBusy = false;
  success: TxResponse | string | null = null;
  error = "";

  now = Date.now() / 1000;

  get available() {
    return vxm.ethBancor.availableBalances;
  }

  get locked() {
    return vxm.ethBancor.lockedBalances;
  }

  async onClick() {
    this.setDefault();
    this.modal = true;
    this.txBusy = true;
    try {
      const result = await vxm.ethBancor.claimBnt();
      this.success = result;
    } catch (err) {
      this.error = err.message;
    } finally {
      this.txBusy = false;
    }
  }

  onModalClick() {
    if (this.success) {
      this.setDefault();
      this.modal = false;
    } else if (this.error) {
      this.onClick();
    }
  }

  get modalConfirmButton() {
    return this.error
      ? i18n.t("try_again")
      : this.success
      ? i18n.t("close")
      : this.txBusy
      ? `${i18n.t("processing")}...`
      : i18n.t("confirm");
  }

  setDefault() {
    this.error = "";
    this.success = null;
    this.txBusy = false;
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
