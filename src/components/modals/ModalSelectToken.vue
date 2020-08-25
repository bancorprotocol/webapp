<template>
  <base-modal
    :id="name"
    size="sm"
    :search.sync="tokenSearch"
    @update:search="currentStep = 1"
    title="Select a Token"
    v-on:on-hide-modal="tokenSearch = ''"
    :fixed-height="true"
  >
    <div>
      <b-row>
        <b-col cols="12">
          <span
            class="text-uppercase font-w500 font-size-12"
            :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          >
            Tokens
          </span>
        </b-col>
        <b-col
          cols="12"
          v-for="token in searchedTokens.slice(0, currentStep * perStep)"
          :key="token.id"
          class="my-3 cursor"
          @click="$emit('select-token', { token, name })"
        >
          <div
            class="d-flex align-items-center justify-content-between"
            :class="darkMode ? 'text-dark' : 'text-light'"
          >
            <div>
              <img
                :src="token.logo"
                class="img-avatar img-avatar32 mr-2"
                alt="Token Logo"
              />
              <span class="font-w600 font-size-14">{{ token.symbol }}</span>
            </div>
            <span v-if="isAuthenticated" class="font-w500 font-size-12">{{
              formattedBalance(token.balance)
            }}</span>
          </div>
        </b-col>
        <b-col cols="12" class="mb-3 text-center">
          <main-button
            v-if="totalTokens > perStep * currentStep"
            @click="currentStep++"
            label="more"
            :small="true"
          />
        </b-col>
        <b-col
          v-if="!searchedTokens.length"
          class="text-center font-size-16 font-w500 mt-3"
        >
          <span :class="darkMode ? 'text-dark' : 'text-light'">
            No results found.
          </span>
        </b-col>
      </b-row>
    </div>
  </base-modal>
</template>

<script lang="ts">
import { Watch, Component, Vue, Prop } from "vue-property-decorator";
import { vxm } from "@/store";
import BaseModal from "@/components/common/BaseModal.vue";
import { ViewRelay, ViewToken } from "@/types/bancor";
import { formatNumber } from "@/api/helpers";
import MainButton from "@/components/common/Button.vue";

@Component({
  components: { BaseModal, MainButton }
})
export default class ModalSelectToken extends Vue {
  @Prop({ default: "modal-swap-select" }) name!: string;
  tokenSearch: string = "";

  perStep = 30;
  currentStep = 1;

  get totalTokens() {
    return this.searchedTokens.length;
  }

  get isAuthenticated() {
    return vxm.wallet.isAuthenticated;
  }

  formattedBalance(num: string = "0") {
    return formatNumber(parseFloat(num), 8);
  }

  get searchedTokens() {
    return this.tokenSearch
      ? this.tokens.filter(token =>
          token.symbol.toLowerCase().includes(this.tokenSearch.toLowerCase())
        )
      : this.tokens;
  }

  get tokens(): ViewToken[] {
    return vxm.bancor.tokens;
  }

  get darkMode(): boolean {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
