<template>
  <div v-if="small" class="d-flex align-items-center py-1">
    <div class="cursor" @click="dropdownEvent">
      <img class="img-avatar img-avatar-thumb" :src="img" alt="Token Logo" />
    </div>
    <div class="ml-4 text-left">
      <h3 @click="dropdownEvent" class="mb-0 mt-0 text-white cursor">
        {{ symbol }}
      </h3>
      <b-input-group class="mt-1">
        <b-form-input
          :value="amount"
          @update="onTextUpdate"
          class="form-control-alt"
          placeholder="Enter Amount"
        ></b-form-input>
        <b-input-group-append>
          <b-button v-if="dropdown" @click="dropdownEvent">
            {{ symbol }}
            <font-awesome-icon icon="angle-down" />
          </b-button>
          <b-button v-else>{{ symbol }}</b-button>
        </b-input-group-append>
      </b-input-group>
    </div>
  </div>

  <div v-else>
    <div>
      <div>
        <div class="d-flex justify-content-between">
          <p
            class="font-size-sm m-0 text-uppercase"
            :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          >
            {{ inputLabel }}
          </p>
          <balance-label
            :label="label"
            :balance="formattedBalance"
            :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          />
        </div>
        <b-input-group class="mt-1">
          <b-form-input
            type="text"
            debounce="500"
            v-model="tokenAmount"
            :class="
              darkMode ? 'form-control-alt-dark' : 'form-control-alt-light'
            "
            placeholder="Enter Amount"
          ></b-form-input>
          <b-input-group-append>
            <div
              v-if="dropdown"
              @click="dropdownEvent"
              class="rounded-right d-flex align-items-center px-2 cursor"
              :class="darkMode ? 'bg-body-dark' : 'bg-light'"
            >
              <div class="d-flex align-items-center">
                <img
                  @click="click"
                  class="img-avatar img-avatar32 cursor border-colouring bg-white mr-1"
                  :src="img"
                  alt="Token Logo"
                />
                <span class="px-1">{{ symbol }}</span>
                <font-awesome-icon icon="caret-down" class="text-muted ml-1" />
              </div>
            </div>
            <div
              v-else
              variant="light"
              class="rounded-right d-flex align-items-center px-2 cursor"
              :class="darkMode ? 'bg-body-dark' : 'bg-light'"
            >
              <img
                @click="click"
                class="img-avatar img-avatar32 cursor border-colouring bg-white mr-1"
                :src="img"
                alt="Token Logo"
              />
              <span class="px-1">{{ symbol }}</span>
              <font-awesome-icon icon="caret-down" class="text-muted ml-1" />
            </div>
            <b-button
              v-if="toggle"
              :variant="status ? 'success' : 'danger'"
              @click="toggleStatus"
              v-b-tooltip.hover
              :title="status ? 'Sale is Enabled' : 'Sale is Disabled'"
            >
              <font-awesome-icon icon="power-off" />
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </div>
      <percentages
        v-if="balance && errorsList.length < 2"
        @percentUpdate="updatePercent"
        :balance="balance"
        :amount="amount"
        :loading="loadingBalance"
        :label="label"
        class="text-right mt-1"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      />
      <div class="error">
        <div class="error-list mb-2 text-center">
          <b-badge :key="error" v-for="error in errorsList" variant="danger">{{
            error
          }}</b-badge>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Prop,
  Watch,
  Component,
  Vue,
  PropSync,
  Emit
} from "vue-property-decorator";
import { vxm } from "@/store";
import debounce from "lodash.debounce";
import Percentages from "./Percentages.vue";
import BalanceLabel from "./BalanceLabel.vue";
import Big from "bignumber.js";

@Component({
  components: {
    Percentages,
    BalanceLabel
  }
})
export default class TokenAmountInput extends Vue {
  @PropSync("amount", { type: String }) tokenAmount!: string;
  @Prop(Number) balance!: number;
  @Prop(String) img!: string;
  @Prop(String) readonly symbol!: string;
  @Prop(String) readonly inputLabel!: string;
  @Prop(Boolean) loadingBalance?: boolean;
  @Prop(Boolean) status?: boolean;
  @Prop(Boolean) toggle?: boolean;
  @Prop(Boolean) dropdown?: boolean;
  @Prop(Boolean) small?: boolean;
  @Prop(String) label?: string;
  @Prop(String) error?: string;
  @Prop(Array) errors?: string[];
  @Prop({ default: false }) warnBalance?: boolean;

  get errorsList() {
    return [
      ...(this.error ? [this.error] : []),
      ...(this.errors && this.errors.length > 0 ? [...this.errors] : []),
      ...(this.warnBalance && this.insufficientBalance
        ? ["Insufficient Balance"]
        : [])
    ];
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  get insufficientBalance() {
    return Number(this.tokenAmount) > this.balance;
  }

  updatePercent(percentage: string) {
    const newAmount =
      percentage == "100"
        ? this.balance
        : (this.balance * Number(percentage)) / 100;
    this.tokenAmount = String(newAmount);
  }

  get formattedBalance() {
    const big = new Big(this.balance);
    const formattedNumber =
      big.decimalPlaces() < 8 ? big.toString() : Number(big.toFixed(8));
    return `${formattedNumber} ${this.symbol}`;
  }

  @Emit("toggle")
  toggleStatus() {}

  @Emit()
  click() {}

  @Emit("dropdown")
  dropdownEvent() {}
}
</script>

<style lang="scss" scoped>
.error-list {
  :first-child {
    margin-right: 3px;
  }
}
</style>
