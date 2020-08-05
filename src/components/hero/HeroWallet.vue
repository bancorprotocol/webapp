<template>
  <div class="content content-full text-center">
    <form v-on:submit.prevent="searchAccount">
      <b-row class="items-push mt-5 d-flex justify-content-center">
        <b-col
          cols="12"
          class="d-flex justify-content-center mb-0 text-white mb-5"
        >
          <font-awesome-icon icon="search" fixed-width class="fa-3x" />
        </b-col>
        <b-col cols="12" class="d-flex justify-content-center mb-0">
          <h3 class="text-white">Enter EOS Account to open Wallet</h3>
        </b-col>
        <b-col
          md="6"
          lg="4"
          xl="3"
          class="d-flex justify-content-center align-items-center"
        >
          <b-form-input
            v-model="search"
            class="form-control-alt"
            placeholder="Enter Account"
          ></b-form-input>
        </b-col>
        <b-col cols="12" class="d-flex justify-content-center mb-0">
          <b-btn
            @click="searchAccount"
            type="submit"
            variant="success"
            v-ripple
            class="px-4 py-2"
          >
            <font-awesome-icon icon="search" fixed-width class="mr-2" />
            <span class="font-w700">Search</span>
          </b-btn>
        </b-col>
      </b-row>
    </form>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";

@Component
export default class HeroWallet extends Vue {
  @Prop() account!: string;

  search = "";

  searchAccount() {
    this.$router.push({
      name: "WalletAccount",
      params: { account: this.search }
    });
  }

  async created() {
    if (this.account) this.search = this.account;
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
  transform: translateY(150px);
  opacity: 0;
}
.slide-fade-up-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-150px);
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
  transform: translateY(-150px);
  opacity: 0;
}
.slide-fade-down-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(150px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
 {
  opacity: 0;
}

.hero {
  height: calc(100vh - 60px);
}
</style>
