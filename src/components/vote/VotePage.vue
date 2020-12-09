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
    } catch {
      console.error("unable to load vote");
    }
  }
}
</script>

<style lang="scss" scoped>

/* tricky fix for media query */
@media screen and (min-width: 992px) and (max-width: 1130px) {
  .col-lg-2 {
    -webkit-box-flex: 0;    
    flex: 0 0 25%;
    max-width: 25%;    
  }
  .col-lg-10 {
    -webkit-box-flex: 0;    
    flex: 0 0 75%;
    max-width: 75%;
  }

}

</style>