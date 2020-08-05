<template>
  <hero-wrapper>
    <div>
      <b-row>
        <b-col md="4" class="text-center">
          <token-amount-input
            :amount.sync="amount"
            :balance="focusedToken.balance"
            :img="focusedToken.logo"
            :symbol="focusedToken.symbol"
          />
        </b-col>
        <b-col
          md="4"
          class="d-flex justify-content-center align-items-end"
          style="min-height: 230px"
        >
          <div>
            <font-awesome-icon
              icon="long-arrow-alt-right"
              class="fa-2x text-white"
            />
            <div class="mb-3 mt-3">
              <span class="text-white font-size-sm"
                >Value: {{ usdValue }} USD</span
              >
            </div>
            <div class="d-flex justify-content-center">
              <b-btn
                @click="initTransfer"
                variant="info"
                :disabled="!isAuthenticated"
                v-ripple
                class="px-4 py-2 d-block"
              >
                <font-awesome-icon
                  icon="long-arrow-alt-right"
                  fixed-width
                  class="mr-2"
                />
                <span class="font-w700">TRANSFER</span>
              </b-btn>
            </div>
            <span @click="navConvert" class="cursor font-size-sm text-white-50">
              <font-awesome-icon icon="exchange-alt" fixed-width />CONVERT
            </span>
          </div>
        </b-col>
        <b-col md="4">
          <div>
            <div class="font-size-lg text-white">Recipient</div>
            <b-form-input
              v-model="recipient"
              class="form-control-alt mt-2"
              placeholder="enter account"
              list="contacts"
            ></b-form-input>
            <datalist id="contacts">
              <option v-for="(contact, index) in contactHistory" :key="index">
                {{ contact }}
              </option>
            </datalist>
          </div>
          <div class="mt-2">
            <div class="text-white">Memo</div>
            <b-form-textarea
              v-model="memo"
              placeholder="optional"
              class="mt-2"
              rows="2"
              max-rows="4"
            ></b-form-textarea>
          </div>
        </b-col>
      </b-row>
    </div>
  </hero-wrapper>
</template>

<script lang="ts">
import { Watch, Component, Vue, Prop } from "vue-property-decorator";
import { vxm } from "@/store";
import numeral from "numeral";
import HeroWrapper from "@/components/hero/HeroWrapper.vue";
import TokenAmountInput from "@/components/convert/TokenAmountInput.vue";
import { multiContract } from "@/api/multiContractTx";
import wait from "waait";
import { compareString } from "../../../api/helpers";

@Component({
  components: {
    HeroWrapper,
    TokenAmountInput
  },
  beforeRouteEnter: async (to, from, next) => {
    if (vxm.bancor.tokens.length == 0) {
      await vxm.bancor.init();
    }
    next();
  }
})
export default class HeroTransfer extends Vue {
  loadingBalance = false;
  numeral = numeral;
  contactHistory: string[] = [];

  amount = "";
  memo = "";
  recipient = "";

  get isAuthenticated() {
    return vxm.eosWallet.isAuthenticated;
  }

  get focusedToken() {
    return vxm.bancor.token(this.selectedIdOrDefault)!;
  }

  async loadHistory() {
    let transferHistory = localStorage.getItem("transferHistory");
    if (transferHistory) {
      const contacts = JSON.parse(transferHistory);
      let array: string[] = [];
      for (const c of contacts) {
        if (
          !(
            array.length &&
            array.find((a: string) => {
              return a === c.to;
            })
          )
        )
          array.push(c.to);
      }
      this.contactHistory = array;
    }
  }

  get usdValue() {
    return numeral(Number(this.amount) * this.focusedToken.price).format(
      "$0,0.00"
    );
  }

  async initTransfer() {
    await vxm.eosNetwork.transfer({
      to: this.recipient,
      memo: this.memo,
      id: this.focusedToken.symbol,
      amount: Number(this.amount)
    });

    this.recipient = "";
    this.amount = "";
    this.memo = "";
  }

  get selectedIdOrDefault() {
    return this.$route.params.id || this.defaultId;
  }

  get defaultId() {
    return vxm.bancor.tokens.find((token: any) => token.symbol !== "BNT")!.id;
  }

  navConvert() {
    this.$router.push({
      name: "Token",
      params: {
        symbolName: this.selectedIdOrDefault
      }
    });
  }

  async created() {
    this.loadHistory();
  }
}
</script>

<style scoped lang="scss">
.slide-fade-up-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-up-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-up-enter
    /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(250px);
  opacity: 0;
}
.slide-fade-up-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-250px);
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
  transform: translateY(-250px);
  opacity: 0;
}
.slide-fade-down-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(250px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
