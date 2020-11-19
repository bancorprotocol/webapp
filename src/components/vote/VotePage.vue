<template>
  <b-row v-if="loaded">
    <b-col class="col-12 col-sm-3 col-lg-2">
      <stake />
    </b-col>
    <b-col class="col-12 col-sm-9 col-lg-10">
      <proposals />
    </b-col>
  </b-row>
  <span v-else>
    <div class="d-flex justify-content-center align-items-center my-5">
      <b-spinner
        style="display: block; width: 2rem; height: 2rem"
        class="align-self-center align-middle"
        :class="darkMode ? 'text-primary' : 'text-primary'"
        label="Loading..."
      ></b-spinner>
      <h5
        class="m-0 ml-3"
        :class="darkMode ? 'text-body-dark' : 'text-muted-light'"
      >
        Just a moment ...
      </h5>
    </div>
  </span>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import Stake from "@/components/vote/stake/Stake.vue";
import Proposals from "@/components/vote/proposals/Proposals.vue";

@Component({
  components: {
    Stake,
    Proposals
  }
})
export default class VotePage extends Vue {
  get isEth() {
    return this.$route.params.service === "eth";
  }

  get loaded() {
    return vxm.ethGovernance.isLoaded;
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  async mounted() {
    try {
      await vxm.ethGovernance.init();
    } catch {
      console.error("unable to load vote");
    }
  }
}
</script>

<style lang="scss"></style>
