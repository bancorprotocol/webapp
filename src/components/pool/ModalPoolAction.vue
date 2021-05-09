<template>
  <modal-base
    v-model="modal"
    @input="setDefault"
    :title="$t('you_will_receive')"
  >
    <b-row class="d-flex justify-content-center">
      <action-modal-status
        v-if="txBusy || error || success"
        :error="error"
        :success="success"
        :step-description="
          sections.length ? sections[stepIndex].description : undefined
        "
      />
    </b-row>
  </modal-base>
</template>

<script lang="ts">
import { Component, Prop, VModel, Watch } from "vue-property-decorator";
import { vxm } from "@/store/";
import { i18n } from "@/i18n";
import {
  LiquidityParams,
  Step,
  TxResponse,
  ViewRelay,
  ViewReserve
} from "@/types/bancor";
import SelectPoolRow from "@/components/pool/SelectPoolRow.vue";
import PoolLogos from "@/components/common/PoolLogos.vue";
import AdvancedBlockItem from "@/components/common/AdvancedBlockItem.vue";
import MainButton from "@/components/common/Button.vue";
import ModalBase from "@/components/modals/ModalBase.vue";
import ActionModalStatus from "@/components/common/ActionModalStatus.vue";
import numeral from "numeral";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: {
    ActionModalStatus,
    AdvancedBlockItem,
    PoolLogos,
    ModalBase,
    SelectPoolRow,
    MainButton
  }
})
export default class ModalPoolAction extends BaseComponent {
  @VModel({ type: Boolean }) modal!: boolean;
  @Prop() amountsArray!: string[];
  @Prop() selectedToken?: ViewReserve;
  @Prop() advancedBlockItems!: any[];
  numeral = numeral;

  txBusy = false;
  success: TxResponse | null = null;
  error = "";
  sections: Step[] = [];
  stepIndex = 0;

  get pool(): ViewRelay {
    return vxm.bancor.relay(this.$route.params.account);
  }

  get withdrawLiquidity(): boolean {
    return this.$route.params.poolAction === "remove";
  }

  setDefault() {
    this.sections = [];
    this.error = "";
    this.success = null;
  }

  async initAction() {
    if (this.success) {
      this.$bvModal.hide("modal-pool-action");
      this.success = null;
      await this.$router.push({ name: "Portfolio" });
      return;
    }

    if (this.error) {
      this.error = "";
      return;
    }

    this.setDefault();

    const params: LiquidityParams = {
      id: this.pool.id,
      reserves: [],
      onUpdate: this.onUpdate
    };

    // Add AND Remove Liquidity V1
    if (!this.pool.v2) {
      params.reserves.push({
        id: this.pool.reserves[0].id,
        amount: this.amountsArray[1]
      });
      params.reserves.push({
        id: this.pool.reserves[1].id,
        amount: this.amountsArray[2]
      });
    } else {
      // Add V2
      if (this.$route.params.poolAction === "add" && this.selectedToken) {
        params.reserves.push({
          id: this.selectedToken.id,
          amount: this.amountsArray[1]
        });
        // Remove V2
      } else if (
        this.$route.params.poolAction === "remove" &&
        this.selectedToken
      ) {
        params.reserves.push({
          id: this.selectedToken.id,
          amount: this.amountsArray[0]
        });
      }
    }

    // Add Liquidity V2
    if (this.selectedToken && this.pool.v2) {
      // params.reserves.push({
      //   id: this.selectedToken.id,
      //   amount: this.amountsArray[1]
      // });
    } else {
      // Remove Liquidity V2
      if (this.selectedToken) {
        params.reserves.push({
          id: this.selectedToken.id,
          amount: this.amountsArray[0]
        });
      }
    }

    try {
      this.txBusy = true;
      let txResult: any;

      if (!this.withdrawLiquidity)
        txResult = await vxm.bancor.addLiquidity(params);
      else txResult = await vxm.bancor.removeLiquidity(params);
      this.success = txResult;
    } catch (e) {
      this.error = e.message;
    } finally {
      this.txBusy = false;
    }
  }

  onUpdate(stepIndex: number, steps: Step[]) {
    this.stepIndex = stepIndex;
    this.sections = steps;
  }

  @Watch("modal")
  onModalShow(val: boolean) {
    if (val) this.initAction();
  }
}
</script>
<style lang="scss">
.modal-body {
  padding-top: 0 !important;
}
</style>
