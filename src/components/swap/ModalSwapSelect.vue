<template>
  <base-modal
    :id="name"
    size="sm"
    :search.sync="tokenSearch"
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
          v-for="token in searchedTokens"
          :key="token.id"
          class="my-3 cursor"
          @click="selectToken(token)"
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
            <span class="font-w500 font-size-12">{{
              formattedBalance(token.balance)
            }}</span>
          </div>
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
import BaseModal from "@/components/common-v2/BaseModal.vue";
import { ViewRelay, ViewToken } from "@/types/bancor";
import { formatNumber } from "@/api/helpers";

@Component({
  components: { BaseModal }
})
export default class ModalSwapSelect extends Vue {
  @Prop({ default: "modal-swap-select" }) name!: string;
  tokenSearch: string = "";

  selectToken(token: ViewToken): void {
    if (this.name === "token1") {
      if (token.id === this.$route.query.to) {
        this.$router.push({
          name: "Swap",
          query: {
            from: this.$route.query.to,
            to: this.$route.query.from
          }
        });
      } else {
        this.$router.push({
          name: "Swap",
          query: {
            from: token.id,
            to: this.$route.query.to
          }
        });
      }
    } else {
      if (token.id === this.$route.query.from) {
        this.$router.push({
          name: "Swap",
          query: {
            from: this.$route.query.to,
            to: this.$route.query.from
          }
        });
      } else {
        this.$router.push({
          name: "Swap",
          query: {
            from: this.$route.query.from,
            to: token.id
          }
        });
      }
    }
    this.$bvModal.hide(this.name);
  }

  formattedBalance(num: number = 0) {
    return formatNumber(num, 8);
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
