<template>
  <div>
    <label-content-split :label="label" class="mb-1">
      <span
        @click="tokenAmount = balance"
        v-if="isAuthenticated"
        class="font-size-12 font-w500 cursor"
      >
        Balance: {{ formattedBalance }}
        {{ usdValue ? usdValue : "" }}
      </span>
    </label-content-split>

    <b-input-group>
      <b-form-input
        type="text"
        :debounce="300"
        v-model="tokenAmount"
        style="border-right: 0 !important;"
        :class="darkMode ? 'form-control-alt-dark' : 'form-control-alt-light'"
        placeholder="Enter Amount"
        :disabled="disabled"
        @keypress="isNumber($event)"
      ></b-form-input>

      <b-input-group-append :class="{ cursor: pool || dropdown }">
        <div
          class="rounded-right d-flex align-items-center px-2"
          :class="darkMode ? 'form-control-alt-dark' : 'form-control-alt-light'"
          style="border-left: 0 !important;"
        >
          <div
            v-if="token"
            @click="openSwapModal"
            class="d-flex align-items-center"
          >
            <img
              class="img-avatar img-avatar32 border-colouring bg-white mr-1"
              :src="token.logo"
              alt="Token Logo"
            />
            <span
              class="px-1 font-size-14 font-w600"
              :class="darkMode ? 'text-dark' : 'text-light'"
            >
              {{ token.symbol }}
            </span>
            <font-awesome-icon v-if="dropdown" icon="caret-down" />
          </div>

          <div v-else>
            <pool-logos
              @click.native="$bvModal.show('modal-join-pool')"
              :pool="pool"
              :dropdown="true"
            />
          </div>
        </div>
      </b-input-group-append>
      <alert-block
        v-if="isAuthenticated && errorMsg !== ''"
        variant="error"
        :msg="errorMsg"
      />
    </b-input-group>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, PropSync } from "vue-property-decorator";
import { vxm } from "@/store/";
import { ViewRelay, ViewReserve } from "@/types/bancor";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import PoolLogos from "@/components/common/PoolLogos.vue";
import { formatNumber } from "@/api/helpers";
import AlertBlock from "@/components/common/AlertBlock.vue";

@Component({
  components: { AlertBlock, PoolLogos, LabelContentSplit }
})
export default class TokenInputField extends Vue {
  @Prop() name?: string;
  @Prop() label!: string;
  @Prop() token?: ViewReserve;
  @Prop() pool?: ViewRelay;
  @Prop() balance!: string;
  @Prop() usdValue?: number;
  @PropSync("amount", { type: String }) tokenAmount!: string;
  @Prop({ default: false }) dropdown!: boolean;
  @Prop({ default: false }) ignoreError!: boolean;
  @Prop({ default: "" }) errorMsg!: string;
  @Prop({ default: false }) disabled!: boolean;

  get formattedBalance() {
    return formatNumber(parseFloat(this.balance), 6).toString();
  }

  isNumber(evt: any) {
    evt = evt ? evt : window.event;
    let charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      evt.preventDefault();
    } else {
      if (charCode === 46) {
        if (this.tokenAmount.includes(".")) evt.preventDefault();
        else {
          return true;
        }
      } else return true;
    }
  }

  openSwapModal() {
    if (this.dropdown && this.name) this.$emit("open-swap-modal", this.name);
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  get isAuthenticated() {
    return vxm.wallet.isAuthenticated;
  }
}
</script>

<style lang="scss">
.no-border-left {
  border-left: 0 !important;
}
</style>
