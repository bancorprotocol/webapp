<template>
  <b-container fluid="xl" class="px-xl-0">
    <b-row>
      <b-col cols="12">
        <div>
          <span
            class="font-size-20 font-w600"
            :class="darkMode ? 'text-dark' : 'text-light'"
          >
            {{ $t("liquidity_protection") }}
          </span>
        </div>

        <p
          class="font-size-14 font-w400 my-3"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          {{ $t("protect_tokens") }}
        </p>
      </b-col>

      <b-col lg="6">
        <ProtectedSummary v-if="positions.length" :positions="positions" />
      </b-col>
      <b-col lg="6">
        <RewardsSummary v-if="positions.length" :positions="positions" />
      </b-col>

      <b-col cols="12">
        <content-block
          :px0="true"
          :shadow-light="true"
          :title="
            positions.length ? $t('protected_positions') : $t('protected')
          "
          :search.sync="searchProtected"
        >
          <div v-if="loading" class="d-flex justify-content-center my-3">
            <b-spinner
              style="width: 3rem; height: 3rem"
              class="text-primary"
              :label="`${$t('loading')}... `"
            />
          </div>
          <div v-else>
            <ProtectedTable :positions="positions" :search="searchProtected" />
          </div>
        </content-block>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12">
        <span
          class="font-size-20 font-w600"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          {{ $t("closed_positions") }}
        </span>

        <p
          class="font-size-14 font-w400 my-3"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          {{ $t("unstaking_positions") }}
        </p>
      </b-col>
      <b-col cols="12">
        <content-block :px0="true" :shadow-light="true" :title="$t('claim')">
          <claim :search="searchClaim" />
        </content-block>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { vxm } from "@/store";
import ProtectedTable from "@/components/protection/ProtectedTable.vue";
import ContentBlock from "@/components/common/ContentBlock.vue";
import Claim from "@/components/protection/Claim.vue";
import BaseComponent from "@/components/BaseComponent.vue";
import { ViewProtectedLiquidity } from "@/types/bancor";
import ProtectedSummary from "@/components/protection/ProtectedSummary.vue";
import RewardsSummary from "@/components/rewards/RewardsSummary.vue";

@Component({
  components: {
    RewardsSummary,
    ProtectedSummary,
    Claim,
    ContentBlock,
    ProtectedTable
  }
})
export default class ProtectionHome extends BaseComponent {
  searchProtected = "";
  searchClaim = "";

  get positions(): ViewProtectedLiquidity[] {
    return vxm.ethBancor.protectedPositions;
  }

  get loading() {
    if (this.currentUser) return vxm.ethBancor.loadingProtectedPositions;
    else return false;
  }
}
</script>

<style lang="scss"></style>
