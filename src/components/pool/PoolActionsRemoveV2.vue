<template>
  <div v-if="selectedToken && !loadingTokens">
    <label-content-split :label="$t('pool')" class="my-4">
      <pool-logos @click="poolLogosClick" :pool="pool" :dropdown="true" />
      <modal-pool-select
        v-model="poolSelectModal"
        :pools="pools"
        @select="select"
      />
    </label-content-split>

    <label-content-split :label="$t('select_pool_token')" class="mb-3">
      <b-form-group class="m-0" :class="darkMode ? 'text-dark' : 'text-light'">
        <b-form-radio-group
          id="radio-group"
          v-model="selectedToken"
          name="radio-component"
        >
          <b-form-radio
            v-for="reserve in poolTokens"
            :name="reserve.symbol"
            :value="reserve.id"
            :key="reserve.id"
            :disabled="reserve.disabled"
          >
            <div class="d-flex align-items-center">
              <img
                class="img-avatar img-avatar20 mr-1"
                :src="reserve.logo"
                :alt="$t('token_logo')"
              />
              <span class="font-w600 font-size-14">{{ reserve.symbol }}</span>
            </div>
          </b-form-radio>
        </b-form-radio-group>
      </b-form-group>
    </label-content-split>

    <percentage-slider
      :label="$t('amount')"
      v-model="percentage"
      @input="percentageUpdate"
      :show-buttons="true"
      :buttons-dirty="percentageDirty"
    />

    <div>
      <token-input-field
        :label="$t('input')"
        :token="selectedPoolToken"
        v-model="amountSmartToken"
        @input="poolTokenUpdate"
        :balance="selectedPoolToken.balance"
        class="mt-4"
        :error-msg="balanceError"
      />

      <div class="text-center my-3">
        <font-awesome-icon
          icon="long-arrow-alt-down"
          class="text-primary font-size-16"
        />
      </div>

      <label-content-split
        v-if="exitFee !== 0"
        :label="$t('exit_fee')"
        class="my-3"
      >
        <span
          class="font-size-12 font-w600"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          {{ exitFee }}%
        </span>
      </label-content-split>

      <label-content-split :label="$t('output')" class="my-3">
        <span
          class="font-size-12 font-w600"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          <span v-if="!loadingReturn">
            {{ expectedReturn ? expectedReturn : "0" }}
          </span>
          <font-awesome-icon v-else icon="circle-notch" spin class="mr-2" />
          {{ selectedPoolToken.symbol }}
        </span>
      </label-content-split>
    </div>

    <alert-block
      v-if="exitFee > 0.1"
      variant="warning"
      :msg="$t('pool_not_balanced')"
      class="mb-3"
    />

    <main-button
      :label="$t('remove')"
      @click="initAction"
      :active="true"
      :large="true"
      class="mt-1"
      :disabled="!amountSmartToken || balanceError !== ''"
    />

    <modal-pool-action
      v-model="modal"
      :amounts-array="[amountSmartToken, expectedReturn]"
      :selected-token="selectedPoolToken"
      :advanced-block-items="advancedBlockItems"
    />
  </div>
  <div v-else>
    <h3 class="text-center my-5">
      <font-awesome-icon icon="circle-notch" spin class="text-primary" />
    </h3>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from "vue-property-decorator";
import { vxm } from "@/store/";
import { i18n } from "@/i18n";
import { ViewRelay } from "@/types/bancor";
import PoolLogos from "@/components/common/PoolLogos.vue";
import MainButton from "@/components/common/Button.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import ModalPoolAction from "@/components/pool/ModalPoolAction.vue";
import { compareString } from "@/api/helpers";
import TokenInputField from "@/components/common/TokenInputField.vue";
import BigNumber from "bignumber.js";
import AlertBlock from "@/components/common/AlertBlock.vue";
import PercentageSlider from "@/components/common/PercentageSlider.vue";
import ModalPoolSelect from "@/components/modals/ModalSelects/ModalPoolSelect.vue";
import BaseComponent from "@/components/BaseComponent.vue";

interface PoolTokenUI {
  disabled: boolean;
  balance: string;
  id: string;
  symbol: string;
  logo: string[];
}

@Component({
  components: {
    ModalPoolSelect,
    PercentageSlider,
    AlertBlock,
    TokenInputField,
    ModalPoolAction,
    LabelContentSplit,
    PoolLogos,
    MainButton
  }
})
export default class PoolActionsRemoveV2 extends BaseComponent {
  @Prop() pool!: ViewRelay;

  percentage: string = "50";
  exitFee = 0;
  percentageDirty = false;

  selectedToken: string = "";

  amountSmartToken = "";

  expectedReturn = "";
  loadingReturn = false;

  errorMessage = "";
  modal: boolean = false;

  poolTokens: PoolTokenUI[] = [];
  insufficientBalance: boolean = false;

  poolSelectModal = false;

  get loadingTokens() {
    return this.selectedToken ? false : vxm.bancor.loadingTokens;
  }

  get pools() {
    return vxm.bancor.relays.filter(x => x.v2);
  }

  get balanceError() {
    if (this.errorMessage) return this.errorMessage;
    if (!this.currentUser) return "";
    if (this.amountSmartToken === "") return "";
    if (this.insufficientBalance) return i18n.t("insufficient_balance");
    else return "";
  }

  get selectedPoolToken() {
    const selectedToken = this.poolTokens.find(
      token => token.id == this.selectedToken
    );
    return selectedToken!;
  }

  async initAction() {
    if (this.currentUser) this.modal = true;
    //@ts-ignore
    else await this.promptAuth();
  }

  select(id: string) {
    this.$router.push({
      name: "PoolAction",
      params: {
        poolAction: "remove",
        account: id
      }
    });
  }

  get advancedBlockItems() {
    return [
      {
        label: `${i18n.t("liquidate")} `,
        value: `${Number(this.amountSmartToken)} ${
          this.selectedPoolToken.symbol
        }`
      },
      {
        label: i18n.t("exit_fee"),
        value: `${this.exitFee}%`
      }
    ];
  }

  @Watch("currentUser")
  authChange(currentUser: string | boolean) {
    if (currentUser) {
      this.getPoolBalances();
    }
  }

  poolLogosClick() {
    this.poolSelectModal = true;
  }

  async getPoolBalances() {
    if (!this.currentUser) return;
    const res = await vxm.bancor.getUserBalances(this.pool.id);
    const contrastAgainstReserves = {
      ...res,
      iouBalances: res.iouBalances.map(maxWithdraw => ({
        ...maxWithdraw,
        token: this.pool.reserves.find(reserve =>
          compareString(reserve.id, maxWithdraw.id)
        )!
      }))
    };

    const poolTokens: PoolTokenUI[] = contrastAgainstReserves.iouBalances.map(
      iouBalance => {
        const { id, logo, symbol } = iouBalance.token;
        return {
          disabled: Number(iouBalance.amount) == 0,
          balance: iouBalance.amount,
          id,
          logo,
          symbol
        };
      }
    );

    this.poolTokens = poolTokens;
    const tokenToSelect = poolTokens.find(token => !token.disabled);
    this.selectedToken = tokenToSelect!.id;
  }

  async poolTokenUpdate(amount: string) {
    const amountNumber = new BigNumber(amount);
    const poolTokenBalanceNumber = new BigNumber(
      this.selectedPoolToken.balance
    );
    if (amountNumber.gt(poolTokenBalanceNumber))
      this.insufficientBalance = true;
    else this.insufficientBalance = false;
    if (amount == "") {
      this.percentage = "0";
    } else {
      const percentOfBalance = amountNumber
        .div(poolTokenBalanceNumber)
        .times(100)
        .toFixed(0);
      this.percentage = percentOfBalance;
    }
  }

  percentageUpdate(percent: string) {
    this.insufficientBalance = false;
    this.percentageDirty = true;
    const decPercent = Number(percent) / 100;
    if (decPercent === 1)
      this.amountSmartToken = this.selectedPoolToken.balance;

    const BN = BigNumber.clone({ DECIMAL_PLACES: 18, EXPONENTIAL_AT: 256 });
    const poolTokenAmount = new BN(this.selectedPoolToken.balance)
      .times(decPercent)
      .toString();

    this.amountSmartToken = poolTokenAmount;
  }

  @Watch("amountSmartToken")
  async smartTokenChanged(amount: string) {
    this.loadingReturn = true;
    this.errorMessage = "";
    if (amount == "") {
      this.expectedReturn = "";
      this.exitFee = 0;
      return;
    }
    try {
      const res = await vxm.bancor.calculateOpposingWithdraw({
        id: this.pool.id,
        reserves: [
          {
            amount,
            id: this.selectedPoolToken.id
          }
        ],
        changedReserveId: this.selectedPoolToken.id
      });

      this.expectedReturn = res.expectedReturn!.amount;

      if (res.withdrawFee) {
        this.exitFee = Number((res.withdrawFee * 100).toFixed(4));
      }
    } catch (e) {
      this.errorMessage = e.message;
      this.expectedReturn = "?";
    } finally {
      this.loadingReturn = false;
    }
  }

  @Watch("pool")
  async updateSelection() {
    // this.selectedToken = "";
    await this.getPoolBalances();
    // this.percentageUpdate(this.percentage);
  }

  async created() {
    await this.getPoolBalances();
    //this.percentageUpdate(this.percentage);
  }
}
</script>

<style lang="scss"></style>
