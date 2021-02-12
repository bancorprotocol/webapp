<template>
  <modal-base
    v-model="show"
    @input="setDefault"
    :title="$t('confirm_token_swap')"
  >
    <b-row class="d-flex justify-content-center">
      <div v-if="!(txBusy || success || error)">
        <b-col cols="12" class="text-center">
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
            {{
              $t("output_estimated", {
                amount: numeral(slippageTolerance).format("0.0[0]%")
              })
            }}
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
import { Component, Prop, VModel } from "vue-property-decorator";
import { vxm } from "@/store";
import { i18n } from "@/i18n";
import { Step, TxResponse, ViewToken } from "@/types/bancor";
import ActionModalStatus from "@/components/common/ActionModalStatus.vue";
import MainButton from "@/components/common/Button.vue";
import AdvancedBlockItem from "@/components/common/AdvancedBlockItem.vue";
import ModalBase from "@/components/modals/ModalBase.vue";
import numeral from "numeral";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: {
    AdvancedBlockItem,
    ActionModalStatus,
    MainButton,
    ModalBase
  }
})
export default class ModalSwapAction extends BaseComponent {
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
      ? i18n.t("try_again")
      : this.success
      ? i18n.t("close")
      : this.txBusy
      ? `${i18n.t("processing")}...`
      : i18n.t("confirm");
  }

  get slippageTolerance() {
    return vxm.bancor.slippageTolerance;
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
}
</script>

<style scoped lang="scss"></style>
