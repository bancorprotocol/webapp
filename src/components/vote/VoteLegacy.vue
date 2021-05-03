<template>
  <b-row v-if="loaded">
    <b-col class="col-12" sm="3" lg="2">
      <stake />
    </b-col>
    <b-col class="col-12" sm="9" lg="10">
      <proposals />
    </b-col>
  </b-row>
  <span v-else>
    <div class="d-flex justify-content-center align-items-center my-5">
      <b-spinner
        style="display: block; width: 2rem; height: 2rem"
        class="align-self-center align-middle"
        :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
        :label="`${$t('loading')}... `"
      ></b-spinner>
      <h5
        class="m-0 ml-3"
        :class="darkMode ? 'text-body-dark' : 'text-muted-light'"
      >
        {{ `${$t("just_a_moment")}...` }}
      </h5>
    </div>
  </span>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { vxm } from "@/store";
import Stake from "@/components/vote/stake/Stake.vue";
import Proposals from "@/components/vote/proposals/Proposals.vue";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: {
    Stake,
    Proposals
  }
})
export default class VoteLegacy extends BaseComponent {
  get isEth() {
    return this.$route.params.service === "eth";
  }

  get loaded() {
    return vxm.ethGovernance.isLoaded;
  }

  async mounted() {
    try {
      await vxm.ethGovernance.init();
    } catch (e) {
      console.error("unable to load vote", e);
    }
  }
}
</script>

<style lang="scss" scoped></style>
