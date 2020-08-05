<template>
  <div>
    <two-token-hero
      v-if="loaded"
      :tokenOneId.sync="networkId"
      :tokenTwoId.sync="tokenId"
      :tokenOneMeta="networkMeta"
      :tokenTwoMeta="tokenMeta"
      :input-labels="['Input', 'Input']"
      @update:tokenOneId="networkTokenChange"
      @update:tokenTwoId="tokenChange"
      :tokenOneAmount.sync="networkAmount"
      :tokenTwoAmount.sync="tokenAmount"
      :warnBalance="true"
    >
      <div>
        <div v-if="calculationsAvailable" class="mb-3 mt-3">
          <span class="text-white font-size-sm">
            {{ networkTokenReward }}
          </span>
          <div class="text-white font-size-sm">
            {{ tokenReward }}
          </div>
          <div class="text-white font-size-sm">
            {{ networkTokenUsdReward }}
          </div>
        </div>
        <div v-else class="mb-3 mt-3">
          <span class="text-white font-size-sm">
            Enter initial liquidity...
          </span>
        </div>
        <relay-fee-adjuster :fee.sync="fee" />
        <div class="create d-flex justify-content-center">
          <b-btn
            @click="createRelay"
            variant="success"
            v-ripple
            class="px-4 py-2 d-block create"
            :disabled="!createPoolReady"
          >
            <font-awesome-icon icon="plus" fixed-width class="mr-2" />
            <span class="font-w700">Create Pool</span>
          </b-btn>
        </div>
        <modal-multi-tx
          title="Create Pool"
          v-model="txModal"
          :busy="txBusy"
          @input="cleanUpAfterTx"
        >
          <div>
            <stepper
              v-if="sections.length > 1"
              :selectedStep="stepIndex"
              :steps="sections"
              :label="sections[stepIndex].description"
              :numbered="true"
            />
            <token-swap
              :error="error"
              :success="success"
              leftHeader="Network Token"
              :leftImg="selectedNetworkToken.img"
              :leftTitle="selectedNetworkToken.symbol"
              :leftSubtitle="networkAmount"
              rightHeader="Listing token"
              :rightImg="selectedToken.img"
              :rightTitle="selectedToken.symbol"
              :rightSubtitle="tokenAmount"
            >
              <template v-slot:footer>
                <TxModalFooter
                  :error="error"
                  :success="success"
                  :explorerLink="explorerLink"
                  :explorerName="explorerName"
                  @close="txModal = false"
                />
              </template>
            </token-swap>
          </div>
        </modal-multi-tx>
      </div>
    </two-token-hero>
  </div>
</template>

<script lang="ts">
import { Watch, Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import HeroWrapper from "@/components/hero/HeroWrapper.vue";
import TwoTokenHero from "./TwoTokenHero.vue";
import TokenSwap from "@/components/common/TokenSwap.vue";
import ModalMultiTx from "@/components/modals/ModalMultiTx.vue";
import Stepper from "@/components/modals/Stepper.vue";
import RelayFeeAdjuster from "@/components/common/RelayFeeAdjuster.vue";
import { State, Getter, Action, namespace } from "vuex-class";
import {
  LiquidityModule,
  TradingModule,
  CreatePoolModule,
  NetworkChoice,
  ModalChoice
} from "../../../types/bancor";
import wait from "waait";
import TxModalFooter from "@/components/common/TxModalFooter.vue";
import { compareString } from "../../../api/helpers";

const bancor = namespace("bancor");

const choiceById = (id: string) => (choice: NetworkChoice | ModalChoice) =>
  compareString(choice.id, id);

@Component({
  components: {
    HeroWrapper,
    TwoTokenHero,
    TokenSwap,
    ModalMultiTx,
    RelayFeeAdjuster,
    Stepper,
    TxModalFooter
  }
})
export default class HeroConvert extends Vue {
  networkId = "";
  tokenId = "";
  networkAmount = "";
  tokenAmount = "";
  loaded = false;
  fee = null;

  error = "";
  success = "";
  txModal = false;
  txBusy = false;

  sections: { name: string; description: string }[] = [];
  stepIndex = 0;

  @bancor.Action init!: LiquidityModule["init"];
  @bancor.Action createPool!: CreatePoolModule["createPool"];
  @bancor.Action focusSymbol!: TradingModule["focusSymbol"];

  feeFormatter(fee: number) {
    return `${fee} %`;
  }

  networkTokenChange(id: string) {
    this.focusSymbol(id);
    const optionAvailable = vxm.bancor
      .newPoolTokenChoices(id)
      .some(x => compareString(x.id, this.selectedToken.id));
    if (!optionAvailable) {
      const listingToken = vxm.bancor.newPoolTokenChoices(id)[0].id;
      this.tokenId = listingToken;
      this.focusSymbol(listingToken);
    }
  }

  tokenChange(id: string) {
    this.focusSymbol(id);
  }

  cleanUpAfterTx() {
    if (this.success) {
      this.$router.push({ name: "Relays" });
      const newToken = this.tokenChoices.find(
        choice => choice.id !== this.selectedToken.id
      )!.id;
      this.tokenId = newToken;
    }
    this.error = "";
    this.success = "";
  }

  get createPoolReady() {
    return (
      this.isAuthenticated &&
      this.calculationsAvailable &&
      this.sufficientBalance
    );
  }

  get sufficientBalance() {
    return this.tokenOneSufficient && this.tokenTwoSufficient;
  }

  get tokenOneSufficient() {
    return Number(this.networkAmount) <= this.displayedNetworkBalance;
  }

  get tokenTwoSufficient() {
    return Number(this.tokenAmount) <= this.displayedTokenBalance;
  }

  get networkTokenReward() {
    return `1 ${this.selectedNetworkToken.symbol} = ${(
      Number(this.tokenAmount) / Number(this.networkAmount)
    ).toFixed(8)} ${this.selectedToken.symbol}`;
  }

  get tokenReward() {
    return `1 ${this.selectedToken.symbol} = ${(
      Number(this.networkAmount) / Number(this.tokenAmount)
    ).toFixed(8)} ${this.selectedNetworkToken.symbol}`;
  }

  get calculationsAvailable() {
    return Number(this.networkAmount) && Number(this.tokenAmount);
  }

  get currentNetwork() {
    return this.$route.params.service;
  }

  get explorerLink() {
    switch (this.currentNetwork) {
      case "eos":
      case "usds":
        return `https://bloks.io/transaction/${this.success}`;
      case "eth":
        return `https://etherscan.io/tx/${this.success}`;
      default:
        return `https://bloks.io/transaction/${this.success}`;
    }
  }

  get explorerName() {
    switch (this.currentNetwork) {
      case "eos":
      case "usds":
        return `Bloks.io`;
      case "eth":
        return `Etherscan`;
      default:
        return `Bloks.io`;
    }
  }

  get networkTokenUsdReward() {
    return `1 ${this.selectedToken.symbol} = ${(
      (Number(this.networkAmount) / Number(this.tokenAmount)) *
      this.selectedNetworkToken.usdValue
    ).toFixed(4)} USD`;
  }

  get selectedNetworkToken() {
    return vxm.bancor.newNetworkTokenChoices.find(choiceById(this.networkId))!;
  }

  get selectedToken() {
    return this.tokenChoices.find(choiceById(this.tokenId))!;
  }

  get networkMeta() {
    return {
      ...this.selectedNetworkToken,
      choices: this.networkChoices
    };
  }

  get tokenMeta() {
    return {
      ...this.selectedToken,
      choices: this.tokenChoices
    };
  }

  get networkChoices() {
    return vxm.bancor.newNetworkTokenChoices;
  }

  get tokenChoices() {
    return vxm.bancor.newPoolTokenChoices(this.networkId);
  }

  get displayedNetworkBalance() {
    if (this.selectedNetworkToken.balance) {
      return this.selectedNetworkToken.balance;
    } else return 0;
  }

  get displayedTokenBalance() {
    if (this.selectedToken.balance) return this.selectedToken.balance;
    else return 0;
  }

  get isAuthenticated() {
    return vxm.wallet.isAuthenticated;
  }

  onUpdate(stepIndex: number, steps: any[]) {
    this.stepIndex = stepIndex;
    this.sections = steps;
  }

  async createRelay() {
    const fee = this.fee || 0;
    this.txModal = true;
    this.txBusy = true;
    try {
      const txId = await this.createPool({
        reserves: [
          { id: this.networkId, amount: this.networkAmount },
          { id: this.tokenId, amount: this.tokenAmount }
        ],
        fee: fee / 100,
        onUpdate: this.onUpdate
      });
      this.success = txId;
      this.networkAmount = "";
      this.tokenAmount = "";
      this.txBusy = false;
    } catch (e) {
      this.error = e.message;
      this.txBusy = false;
    }
  }

  @Watch("tokenChoices")
  availableInsurance() {
    const tokenChoiceStillExists = this.tokenChoices.some(
      choiceById(this.tokenId)
    );
    if (!tokenChoiceStillExists) this.tokenId = this.tokenChoices[0].id;
  }

  created() {
    const networkId = vxm.bancor.newNetworkTokenChoices[0].id;
    const tokenId = this.tokenChoices[0].id;
    this.networkId = networkId;
    this.tokenId = tokenId;
    this.focusSymbol(networkId);
    this.focusSymbol(tokenId);
    this.loaded = true;
  }
}
</script>

<style scoped lang="scss">
.create {
  margin-top: 15px;
}

.slide-fade-up-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-up-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-up-enter
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(75px);
  opacity: 0;
}

.slide-fade-up-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-75px);
  opacity: 0;
}

.slide-fade-down-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-down-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-down-enter
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-75px);
  opacity: 0;
}

.slide-fade-down-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(75px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to
/* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
