<template>
  <modal-select v-model="show" :items="tokens">
    <template v-slot:item="{ item }">
      <div
        @click="selectToken(item.id)"
        class="d-flex align-items-center justify-content-between"
        :class="darkMode ? 'text-dark' : 'text-light'"
      >
        <div>
          <img
            :src="item.logo"
            class="img-avatar img-avatar32 mr-2"
            alt="Token Logo"
          />
          <span class="font-w600 font-size-14">{{ item.symbol }}</span>
        </div>
        <span v-if="item.balance" class="font-w500 font-size-12">{{
          formattedBalance(item.balance)
        }}</span>
      </div>
    </template>
  </modal-select>
</template>

<script lang="ts">
import { Watch, Component, Vue, Prop, Emit } from "vue-property-decorator";
import { vxm } from "@/store";
import ModalSelect from "@/components/common/ModalSelect.vue";
import { ViewRelay, ViewToken, ViewModalToken } from "@/types/bancor";
import { formatNumber, VModel } from "@/api/helpers";
import MainButton from "@/components/common/Button.vue";

@Component({
  components: { ModalSelect, MainButton }
})
export default class ModalSelectToken extends Vue {
  @VModel() show!: boolean;
  @Prop() tokens!: ViewModalToken[];

  tokenSearch: string = "";

  @Emit("select")
  selectToken(id: string) {
    console.log("modal token select is emitting itself..?", id);
    this.show = false;
    return id;
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

  get darkMode(): boolean {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
