<template>
  <b-container fluid="xl" class="px-xl-0">
    <b-row>
      <b-col cols="12">
        <div class="mt-2">
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
            >Stake</b-btn
          >
        </div>
        <p
          class="font-size-14 font-w400 my-3"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          Add impermanent loss protection to any of your pool token stakings
        </p>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12">
        <content-block :px0="true" :shadow-light="true" :no-header="true">
          <div class="pt-2">
            <div v-if="tabIndex === 0" class="float-right mr-2">
              <multi-input-field
                class="max-search-width-xs"
                v-model="searchProtected"
                placeholder="Search"
                prepend="search"
              />
            </div>

            <b-tabs
              v-model="tabIndex"
              :class="darkMode ? 'tabs-dark' : 'tabs-light'"
            >
              <b-tab title="Protected">
                <protected :search="searchProtected" />
              </b-tab>
              <b-tab v-if="phase2" title="Claim">
                <claim :search="searchProtected" />
              </b-tab>
            </b-tabs>
          </div>
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
  tabIndex = 0;
  searchProtected = "";

  get darkMode() {
    return vxm.general.darkMode;
  }

  get phase2() {
    return vxm.general.phase2;
  }
}
</script>

<style lang="scss"></style>
