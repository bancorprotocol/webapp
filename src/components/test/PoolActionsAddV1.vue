<template>
  <div class="mt-3">    
    <!-- <token-input-field
      label="Input"
      :token="reserveOne"
      v-model="amount1"
      @input="tokenOneChanged"
      :balance="balance1"
      :error-msg="token1Error"
    /> -->    
    <input type="text" label="Input1" id="ipAmt1" v-model="amount1" @input="tokenOneChanged" />
    <div id="reserve1">
      {{reserveOne}}
    </div>
    <div id="balance1">
      {{balance1}}
    </div>
    <div id="error1">
      {{token1Error}}
    </div>

    <div class="text-center my-3">
      <font-awesome-icon icon="plus" class="text-primary font-size-16" />
    </div>
    <!-- <token-input-field
      label="Input"
      :token="reserveTwo"
      v-model="amount2"
      @input="tokenTwoChanged"
      class="mb-3"
      :balance="balance2"
      :error-msg="token2Error"
    /> -->
    <input type="text" label="Input2" id="ipAmt2" v-model="amount2" @input="tokenTwoChanged" />
    <div id="reserve2">
      {{reserveTwo}}
    </div>
    <div id="balance2">
      {{balance2}}
    </div>
    <div id="error2">
      {{token2Error}}
    </div>

    <h4>Prices and Pool Share</h4>
    <b-row>
      <b-col
        v-for="item in shareBlockItems"
        :key="item.id"
        cols="4"
        class="text-center"
      >
        <div>
          <span
            class="font-size-12 text-light"            
          >
            {{ item.title }}
          </span>
        </div>
        <span
          class="font-size-12 font-w500 text-muted-light"          
        >
          {{ item.label }}
        </span>
      </b-col>
    </b-row>

    <!-- <rate-share-block :items="shareBlockItems" label="Prices and Pool Share" /> -->
    <!-- <main-button
      @click="initAction"
      label="Supply"
      :active="true"
      :large="true"
      class="mt-3"
      :loading="rateLoading"
      :disabled="disableMainButton"
    /> -->
    <!-- <modal-pool-action
      v-model="modal"
      :amounts-array="[smartTokenAmount, amount1, amount2]"
      :advanced-block-items="advancedBlockItems"
    /> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { State, Getter, Mutation, Action, namespace } from "vuex-class";
import { ViewRelay, ViewAmount } from "@/types/bancor";
// import TokenInputField from "@/components/common/TokenInputField.vue";
// import MainButton from "@/components/common/Button.vue";
// import ModalPoolAction from "@/components/pool/ModalPoolAction.vue";
// import RateShareBlock from "@/components/common/RateShareBlock.vue";
import { compareString, formatNumber, formatPercent } from "@/components/test/mockHelper";
import { ViewToken } from "@/types/bancor";

const bancor = namespace('bancor');
const wallet = namespace('wallet');

@Component({
  components: {
    // RateShareBlock,
    // ModalPoolAction,    
    // TokenInputField,    
    // MainButton
  }
})
export default class PoolActionsAddV1 extends Vue {
  @Prop() pool!: ViewRelay;  

  smartTokenAmount: string = "??.??????";
  amount1: string = "";
  amount2: string = "";
  modal = false;

  singleUnitCosts: any[] = [];
  shareOfPool = 0;

  rateLoading = false;

  token1Error = "";
  token2Error = "";

  @wallet.Getter("currentUser")
  currentUser!: string;  

  @bancor.Getter("token")
  getterToken!: (tokenId: string) => ViewToken;

  @bancor.Action("calculateOpposingDeposit")
  calculateOpposingDeposit!: (obj: any) => any;  

  get disableMainButton() {
    return (
      this.token1Error !== "" ||
      this.token2Error !== "" ||
      !(this.amount1 && this.amount2)
    );
  }

  async initAction() {
    if (this.currentUser) this.modal = true;
    //@ts-ignore
    else await this.promptAuth();
  }

  get balance1() {    
    return this.getterToken(this.reserveOne.id).balance ?? "0";    
  }

  get balance2() {
    return this.getterToken(this.reserveTwo.id).balance ?? "0";    
  }

  get share() {
    return formatPercent(this.shareOfPool);
  }

  get shareBlockItems() {
    if (this.shareOfPool > 0) {
      return [
        ...this.singleUnitCosts,
        {
          id: "poolShare",
          title: this.share,
          label: "Share of Pool"
        }
      ];
    } else {
      return [
        ...this.singleUnitCosts,
        {
          id: "poolShare",
          label: "Share of Pool",
          title: "0%"
        }
      ];
    }
  }

  get advancedBlockItems() {
    return [
      {
        label: this.reserveOne.symbol + " Deposit",
        value: Number(this.amount1)
      },
      {
        label: this.reserveTwo.symbol + " Deposit",
        value: Number(this.amount2)
      },
      {
        label: "Rates",
        value:
          this.singleUnitCosts.length > 1
            ? `${this.singleUnitCosts[0].title} ${this.singleUnitCosts[0].label}`
            : "0"
      },
      {
        label: "",
        value:
          this.singleUnitCosts.length > 1
            ? `${this.singleUnitCosts[1].title} ${this.singleUnitCosts[1].label}`
            : "0"
      },
      {
        label: "Share of Pool",
        value: this.share
      }
    ];
  }

  get reserveOne() {
    return this.pool.reserves[0];
  }

  get reserveTwo() {
    return this.pool.reserves[1];
  }

  setDefault() {
    this.shareOfPool = 0;
    this.amount2 = "";
    this.amount1 = "";
    this.token1Error = "";
    this.token2Error = "";
  }

  async tokenOneChanged(tokenAmount: string) {
    if (!tokenAmount || tokenAmount === ".") {
      this.setDefault();
      return;
    }
    this.rateLoading = true;
    try {
      const results = await this.calculateOpposingDeposit({
        id: this.pool.id,
        reserves: [
          { id: this.reserveOne.id, amount: tokenAmount },
          { id: this.reserveTwo.id, amount: this.amount2 }
        ],
        changedReserveId: this.reserveOne.id
      });
      if (typeof results.opposingAmount !== "undefined") {
        this.amount2 = results.opposingAmount;
      }

      const raiseToken1InsufficientBalance =
        Number(this.balance1) < Number(tokenAmount);
      this.token1Error = raiseToken1InsufficientBalance
        ? "Insufficient balance"
        : "";

      const raiseToken2InsufficientBalance =
        Number(this.balance2) < Number(this.amount2);
      this.token2Error = raiseToken2InsufficientBalance
        ? "Insufficient balance"
        : "";

      this.shareOfPool = results.shareOfPool;
      this.setSingleUnitCosts(results.singleUnitCosts);
    } catch (e) {
      this.token1Error = e.message;
      this.token2Error = "";
    }
    this.rateLoading = false;
  }

  setSingleUnitCosts(units: ViewAmount[]) {
    const items = units.map(unit => {
      const token = this.pool.reserves.find(reserve =>
        compareString(unit.id, reserve.id)
      )!;
      const opposingToken = this.pool.reserves.find(
        reserve => !compareString(unit.id, reserve.id)
      )!;
      return {
        id: token.id,
        title: formatNumber(Number(unit.amount)),
        label: `${opposingToken.symbol} per ${token.symbol}`
      };
    });
    this.singleUnitCosts = items;
  }

  async tokenTwoChanged(tokenAmount: string) {
    if (!tokenAmount || tokenAmount === ".") {
      this.setDefault();
      return;
    }
    this.rateLoading = true;
    try {
      const results = await this.calculateOpposingDeposit({
        id: this.pool.id,
        reserves: [
          { id: this.reserveTwo.id, amount: tokenAmount },
          { id: this.reserveOne.id, amount: this.amount1 }
        ],
        changedReserveId: this.reserveTwo.id
      });
      if (typeof results.opposingAmount !== "undefined") {
        this.amount1 = results.opposingAmount;
      }
      this.shareOfPool = results.shareOfPool;
      this.setSingleUnitCosts(results.singleUnitCosts);

      const raiseToken1InsufficientBalance =
        Number(this.balance1) < Number(this.amount1);
      this.token1Error = raiseToken1InsufficientBalance
        ? "Insufficient balance"
        : "";

      const raiseToken2InsufficientBalance =
        Number(this.balance2) < Number(tokenAmount);
      this.token2Error = raiseToken2InsufficientBalance
        ? "Insufficient balance"
        : "";
    } catch (e) {
      this.token1Error = "";
      this.token2Error = e.message;
    }
    this.rateLoading = false;
  }

  async initialLoadPrices() {
    const results = await this.calculateOpposingDeposit({
      id: this.pool.id,
      reserves: [
        { id: this.reserveOne.id, amount: this.amount1 },
        { id: this.reserveTwo.id, amount: this.amount2 }
      ],
      changedReserveId: this.reserveOne.id
    });
    console.log('dfdd', results)
    this.setSingleUnitCosts(results.singleUnitCosts);
  }

  created() {
    this.initialLoadPrices();    
  }
}
</script>

<style lang="scss">
.custom-control-inline {
  margin-right: 0 !important;
  margin-left: 1rem !important;
}
.custom-control-label {
  display: inline-flex !important;
  align-items: center !important;
}
</style>
