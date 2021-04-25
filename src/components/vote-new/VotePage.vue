<template>
  <b-row v-if="loaded">
    <b-col cols="12">
      <h3 :class="darkMode ? 'text-dark' : 'text-light'">Vote</h3>
      <p class="font-w500" :class="darkMode ? 'text-dark' : 'text-light'">
        Bancor is a DAO managed by vBNT stakers who determine the future of the
        protocol with their proposals.
      </p>
    </b-col>
    <b-col md="7">
      <stake />
    </b-col>
    <b-col md="5">
      <content-block title="Vote on Snapshot">
        <p
          class="font-w500 font-size-14 mt-4"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          Following vote #50, governance has been moved to Snapshot for 12
          months in order to enable gasless voting and increased participation
          in governance.
        </p>

        <b-btn
          variant="primary"
          size="lg"
          href="https://vote.bancor.network"
          target="_blank"
          class="btn-rounded"
        >
          Vote
        </b-btn>

        <hr />

        <a
          class="font-w500 font-size-14"
          :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
          href="https://blog.bancor.network/gasless-voting-is-live-on-bancor-governance-82d232da16b9"
          target="_blank"
        >
          How to Vote
          <font-awesome-icon icon="external-link-alt" class="ml-2" />
        </a>
      </content-block>
    </b-col>
    <b-col cols="12">
      <h6 class="mb-0" :class="darkMode ? 'text-dark' : 'text-light'">
        Legacy onchain contract
      </h6>
      <hr class="my-2" />
      <p
        class="font-w500 font-size-14 mb-2"
        :class="darkMode ? 'text-dark' : 'text-light'"
      >
        View previous votes and decisions made onchain.
      </p>
      <router-link
        :to="{ name: 'VoteLegacy' }"
        class="font-w500 font-size-14"
        :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
      >
        View Legacy Gov
      </router-link>
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
import Stake from "@/components/vote-new/stake/Stake.vue";
import Proposals from "@/components/vote/proposals/Proposals.vue";
import BaseComponent from "@/components/BaseComponent.vue";
import ContentBlock from "@/components/common/ContentBlock.vue";

@Component({
  components: {
    ContentBlock,
    Stake,
    Proposals
  }
})
export default class VotePage extends BaseComponent {
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
