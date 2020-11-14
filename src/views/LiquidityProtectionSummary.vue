<template>
  <b-container fluid="xl" class="px-xl-0">
    <b-row>
      <b-col cols="12">
        <div>
          <span
            class="font-size-20 font-w600"
            :class="darkMode ? 'text-dark' : 'text-light'"
          >
            Liquidity Protection
          </span>

          <b-btn
            variant="primary"
            class="float-right"
            :to="{ name: 'AddProtectionHome' }"
          >
            Stake
          </b-btn>
        </div>

        <p
          class="font-size-14 font-w400 my-3"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          You can protect your token pools with our special insurance for
          impermanent loss by simply adding insurance to each of your
          transactions.
        </p>
      </b-col>
      <b-col cols="12">
        <content-block
          :px0="true"
          :shadow-light="true"
          title="Protected"
          :search.sync="searchProtected"
        >
          <div v-if="loading" class="d-flex justify-content-center my-3">
            <b-spinner
              style="width: 3rem; height: 3rem;"
              class="text-primary"
              label="Loading..."
            />
          </div>
          <protected v-else :search="searchProtected" />
        </content-block>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12">
        <span
          class="font-size-20 font-w600"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          Closed Positions
        </span>

        <p
          class="font-size-14 font-w400 my-3"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          When unstaking protected positions, you will be able to see and claim
          your BNT here.
        </p>
      </b-col>
      <b-col cols="12">
        <content-block :px0="true" :shadow-light="true" title="Claim">
          <claim :search="searchClaim" />
        </content-block>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import ProtectableLiquidity from "@/components/protection/ProtectableLiquidity.vue";
import Protected from "@/components/protection/Protected.vue";
import ContentBlock from "@/components/common/ContentBlock.vue";
import MultiInputField from "@/components/common/MultiInputField.vue";
import Claim from "@/components/protection/Claim.vue";

@Component({
  components: {
    Claim,
    MultiInputField,
    ContentBlock,
    Protected,
    ProtectableLiquidity
  }
})
export default class LiquidityProtectionSummary extends Vue {
  searchProtected = "";
  searchClaim = "";

  get loading() {
    return vxm.ethBancor.loadingPools;
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
