<template>
  <modal-base v-model="show" @input="setDefault" title="Confirm Token Swap">
    <b-row class="d-flex justify-content-center">
      <div v-if="!(txBusy || success || error)">
        <b-col cols="12">
          <div>
            <div
              class="font-size-24 font-w600 mr-2"
              :class="darkMode ? 'text-dark' : 'text-light'"
            >
              {{ Number(amount1) }} {{ token1.symbol }}
            </div>
            <font-awesome-icon
              icon="exchange-alt"
              rotation="90"
              class="text-primary"
            />
            <div
              class="font-size-24 font-w600 mr-2"
              :class="darkMode ? 'text-dark' : 'text-light'"
            >
              {{ Number(amount2) }} {{ token2.symbol }}
            </div>
          </div>
        </b-col>
        <b-col cols="12">
          <p
            class="font-size-sm font-w400 text-center mt-2 mb-3"
            :class="!darkMode ? 'text-muted-light' : 'text-muted-dark'"
          >
            Output is estimated. If the price changes by more than
            {{ numeral(slippageTolerance).format("0.0[0]%") }} your transaction
            will revert.
          </p>
        </b-col>

        <b-col md="12">
          <div
            class="block block-rounded font-size-sm block-shadow"
            :class="darkMode ? 'bg-body-dark' : 'bg-body-light'"
          >
            <div class="block-content py-2">
              <advanced-block-item
                v-for="item in advancedBlockItems"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </div>
          </div>
        </b-col>
      </div>

      <action-modal-status
        v-if="txBusy || error || success"
        :error="error"
        :success="success"
        :step-description="
          sections.length ? sections[stepIndex].description : undefined
        "
      />

      <b-col cols="12">
        <main-button
          @click="initAction"
          :active="true"
          :label="confirmButton"
          :disabled="txBusy"
          :large="true"
        />
      </b-col>
    </b-row>
  </modal-base>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { vxm } from "@/store";
import { Step, TxResponse, ViewToken } from "@/types/bancor";
import ActionModalStatus from "@/components/common/ActionModalStatus.vue";
import MainButton from "@/components/common/Button.vue";
import AdvancedBlockItem from "@/components/common/AdvancedBlockItem.vue";
import ModalBase from "@/components/modals/ModalBase.vue";
import numeral from "numeral";
import { VModel } from "@/api/helpers";

@Component({
  components: {
    AdvancedBlockItem,
    ActionModalStatus,
    MainButton,
    ModalBase
  }
})
export default class ModalSwapAction extends Vue {
  @VModel({ type: Boolean }) show!: boolean;
  @Prop() amount1!: string;
  @Prop() token1!: ViewToken;
  @Prop() amount2!: string;
  @Prop() token2!: ViewToken;
  @Prop() advancedBlockItems!: any[];

  txBusy = false;
  success: TxResponse | null = null;
  error = "";
  sections: Step[] = [];
  stepIndex = 0;
  numeral = numeral;

  get confirmButton() {
    return this.error
      ? "Try Again"
      : this.success
      ? "Close"
      : this.txBusy
      ? "processing ..."
      : "Confirm";
  }

  get slippageTolerance() {
    return vxm.bancor.slippageTolerance;
  }

  get isCountryBanned() {
    return vxm.general.isCountryBanned;
  }

  setDefault() {
    this.sections = [];
    this.error = "";
    this.success = null;
  }

  async initAction() {
    if (this.success) {
      this.show = false;
      this.setDefault();
      return;
    }

    if (this.error) {
      this.error = "";
      return;
    }

    if (this.isCountryBanned) {
      this.error =
        "This action through swap.bancor.network is not available in your country.";
      return;
    }

    this.setDefault();

    try {
      this.txBusy = true;
      const result = await vxm.bancor.convert({
        from: {
          id: this.token1.id,
          amount: this.amount1
        },
        to: {
          id: this.token2.id,
          amount: this.amount2
        },
        onUpdate: this.onUpdate
      });

      this.success = result;
      // @ts-ignore
      this.$gtag.event("swap", {
        event_category: "success",
        event_label: this.$route.query.from
      });
      // @ts-ignore
      this.$gtag.event("swap", {
        event_category: "success",
        event_label: this.$route.query.to
      });
    } catch (e) {
      this.error = e.message;
      // @ts-ignore
      this.$gtag.event("swap", {
        event_category: "error",
        event_label: this.$route.query.from
      });
      // @ts-ignore
      this.$gtag.event("swap", {
        event_category: "error",
        event_label: this.$route.query.to
      });
    } finally {
      this.txBusy = false;
    }
  }

  onUpdate(stepIndex: number, steps: Step[]) {
    this.stepIndex = stepIndex;
    this.sections = steps;
  }

  get darkMode(): boolean {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
