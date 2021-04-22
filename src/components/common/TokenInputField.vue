<template>
  <div>
    <label-content-split :label="label" class="mb-1">
      <div v-if="currentUser" class="d-flex flex-row font-size-14 font-w400">
        <div @click="maxBalance" class="cursor">
          {{ `${$t("balance")}: ${prettifyNumber(balance)}` }}
        </div>
        <div
          v-if="usdValue"
          class="ml-1"
          :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
        >
          {{ `(~${prettifyNumber(usdValue, true)})` }}
        </div>
      </div>
    </label-content-split>

    <b-input-group>
      <b-form-input
        v-model="tokenAmount"
        @blur.native="blur"
        inputmode="decimal"
        style="border-right: 0 !important"
        :class="darkMode ? 'form-control-alt-dark' : 'form-control-alt-light'"
        :placeholder="$t('enter_amount')"
        :disabled="disabled"
        debounce="300"
        :formatter="formatter"
      ></b-form-input>

      <b-input-group-append :class="{ cursor: pool || dropdown }">
        <div
          class="rounded-right d-flex align-items-center px-2"
          :class="darkMode ? 'form-control-alt-dark' : 'form-control-alt-light'"
          style="border-left: 0 !important"
        >
          <div
            v-if="token"
            @click="openModal"
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
            <pool-logos @click="openModal" :pool="pool" :dropdown="true" />
          </div>
          <div v-if="!pool && !token">
            <img
              class="img-avatar img-avatar32 border-colouring bg-white mr-1"
              :src="defaultImage"
              :alt="$t('token_logo')"
            />
          </div>
        </div>
      </b-input-group-append>
      <alert-block
        v-if="currentUser && errorMsg !== ''"
        variant="error"
        :msg="errorMsg"
      />
      <modal-token-select
        v-if="tokens && tokens.length > 0"
        v-model="modal"
        :allow-token-add="allowTokenAdd"
        :tokens="tokens"
        @select="select"
      />
      <modal-pool-select
        v-if="pools && pools.length > 0"
        v-model="modal"
        :pools="pools"
        @select="select"
      />
    </b-input-group>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, VModel } from "vue-property-decorator";
import { ViewRelay, ViewReserve, ViewModalToken } from "@/types/bancor";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import PoolLogos from "@/components/common/PoolLogos.vue";
import { compareString, formatNumber } from "@/api/helpers";
import AlertBlock from "@/components/common/AlertBlock.vue";
import ModalTokenSelect from "@/components/modals/ModalSelects/ModalTokenSelect.vue";
import ModalPoolSelect from "@/components/modals/ModalSelects/ModalPoolSelect.vue";
import BigNumber from "bignumber.js";
import BaseComponent from "@/components/BaseComponent.vue";
import { ethReserveAddress } from "@/api/eth/ethAbis";
import { defaultImage } from "@/store/modules/swap/ethBancor";

@Component({
  components: {
    AlertBlock,
    PoolLogos,
    LabelContentSplit,
    ModalTokenSelect,
    ModalPoolSelect
  }
})
export default class TokenInputField extends BaseComponent {
  @Prop() label!: string;
  @Prop() token?: ViewReserve;
  @Prop() pool?: ViewRelay;
  @Prop() balance!: string;
  @Prop() usdValue?: number;
  @VModel({ type: String }) tokenAmount!: string;
  @Prop({ default: false }) ignoreError!: boolean;
  @Prop({ default: "" }) errorMsg!: string;
  @Prop({ default: false }) disabled!: boolean;
  @Prop() tokens!: ViewModalToken[];
  @Prop() pools!: ViewRelay[];
  @Prop({ default: false }) allowTokenAdd!: boolean;
  @Prop() blurFunc?: Function;

  get dropdown() {
    return (
      (this.tokens && this.tokens.length > 0) ||
      (this.pools && this.pools.length > 0)
    );
  }

  get defaultImage() {
    return defaultImage;
  }

  @Emit()
  select(id: string) {
    return id;
  }

  modal = false;

  maxBalance() {
    const isEther =
      this.token && compareString(this.token!.contract, ethReserveAddress);

    if (isEther) {
      const leftOverEth = new BigNumber(this.balance).minus(0.01);
      if (leftOverEth.isLessThanOrEqualTo(0)) {
        this.tokenAmount = this.balance;
      } else {
        this.tokenAmount = leftOverEth.toString();
      }
    } else {
      this.tokenAmount = this.balance;
    }
  }

  blur() {
    if (this.blurFunc) this.blurFunc();
  }

  formatter(text: String) {
    if (text === undefined) text = this.tokenAmount;

    return text
      .replace(/[^\d\.]/g, "")
      .replace(/\./, "x")
      .replace(/\./g, "")
      .replace(/x/, ".");
  }

  openModal() {
    this.modal = true;
  }
}
</script>

<style lang="scss"></style>
