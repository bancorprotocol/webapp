<template>
  <div>
    <content-block :shadow="true" class="mb-4">
      <div class="mt-3">
        <label-content-split label="Selected Pool">
          <pool-logos :pool="pool" :dropdown="false" :cursor="false" />
        </label-content-split>   

        <label-content-split label="Exposure">
          <b-form-group
            class="m-0"
            :class="darkMode ? 'text-dark' : 'text-light'"
          >
            <b-form-radio-group
              id="radio-group"
              v-model="selectedToken"
              name="radio-component"
            >
              <b-form-radio
                v-for="reserve in pool.reserves"
                :name="reserve.symbol"
                :value="reserve"
                :key="reserve.id"
              >
                <div class="d-flex align-items-center">
                  <img
                    class="img-avatar img-avatar20 mr-1"
                    :src="reserve.logo"
                    alt="Token Logo"
                  />
                  <span class="font-w600 font-size-14">{{
                    reserve.symbol
                  }}</span>
                </div>
              </b-form-radio>
            </b-form-radio-group>
          </b-form-group>
        </label-content-split>

        <token-input-field
          label="Input"
          :token="selectedToken"
          v-model="amount"
          :balance="balance"
          class="my-3"
          :error-msg="balanceError"
        />

        <label-content-split label="Full Coverage Date" value="??/??/??" />        
      </div>
    </content-block>   
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import { Step, TxResponse, ViewRelay, ViewReserve } from "@/types/bancor";
import TokenInputField from "@/components/common/TokenInputField.vue";
import PoolLogos from "@/components/common/PoolLogos.vue";
import BigNumber from "bignumber.js";

@Component({
  components: {
    PoolLogos,
    TokenInputField,
    LabelContentSplit,
    ContentBlock
  }
})
export default class AddLiqProtection extends Vue {
  amount = "";

  selectedToken: ViewReserve | null = null;

  get pool(): ViewRelay {
    return vxm.bancor.relay(this.$route.params.id);
  }

  get balance() {
    if (this.selectedToken !== null)
      return vxm.bancor.token(this.selectedToken.id).balance ?? "0";
    else return "0";
  }

  get balanceError() {
    const amountNumber = new BigNumber(this.amount);
    const balanceNumber = new BigNumber(this.balance);
    if (amountNumber.gt(balanceNumber)) return "Insufficient balance";
    else return "";
  }

  @Watch("pool")
  onPoolChange() {
    this.selectedToken = this.pool.reserves[0];
    this.amount = "";
  }

  mounted() {
    this.selectedToken = this.pool.reserves[0];
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
