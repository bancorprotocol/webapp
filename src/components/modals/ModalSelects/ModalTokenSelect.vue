<template>
  <modal-select
    v-model="show"
    :search.sync="search"
    :items="searchedTokens"
    title="Select a token"
    subtitle="Tokens"
  >
    <template #item="{ item }">
      <div
        class="d-flex align-items-center justify-content-between"
        :class="darkMode ? 'text-dark' : 'text-light'"
        @click="selectToken(item.id)"
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
    <template v-if="allowTokenAdd" #footer>
      <p>
        Can't find the token you're looking for?
        <span style="color: blue" @click="promptTokenAddModal">Add token</span>
      </p>
      <modal-base v-model="addTokenModal" title="Add Token">
        <multi-input-field
          v-model="addTokenText"
          label="Token Address"
          placeholder="eg. 0x90feoiw..."
          height="48"
          @input="onTokenInput"
        />
        {{ error }}
      </modal-base>
    </template>
  </modal-select>
</template>

<script lang="ts">
import { Watch, Component, Vue, Prop, Emit } from "vue-property-decorator";
import { vxm } from "@/store";
import ModalSelect from "@/components/modals/ModalSelects/ModalSelect.vue";
import ModalBase from "@/components/modals/ModalBase.vue";
import MultiInputField from "@/components/common/MultiInputField.vue";

import { ViewRelay, ViewToken, ViewModalToken } from "@/types/bancor";
import { formatNumber, VModel } from "@/api/helpers";
import MainButton from "@/components/common/Button.vue";
import { isAddress } from "web3-utils";
import wait from "waait";

const INVALID_ADDRESS = "Invalid address";

@Component({
  components: { ModalSelect, MainButton, MultiInputField, ModalBase }
})
export default class ModalSelectToken extends Vue {
  @VModel() show!: boolean;
  @Prop() tokens!: ViewModalToken[];
  @Prop({ default: false }) allowTokenAdd!: boolean;

  search: string = "";
  addTokenModal: boolean = false;
  addTokenText: string = "";
  error: string = "";

  @Emit("select")
  selectToken(id: string) {
    this.show = false;
    return id;
  }

  onTokenInput(input: string) {
    if (isAddress(input)) {
      this.error = "";
      void this.triggerAdd();
    } else {
      if (this.error !== INVALID_ADDRESS) {
        this.error = INVALID_ADDRESS;
      }
    }
  }

  promptTokenAddModal() {
    this.addTokenModal = true;
  }

  async triggerAdd() {
    const tokenAddress = this.addTokenText;
    try {
      await vxm.ethBancor.addToken(tokenAddress);
      this.error = "";
      this.addTokenModal = false;
    } catch (e) {
      this.error = e.message;
    }
  }

  formattedBalance(num: string = "0") {
    return formatNumber(parseFloat(num), 8);
  }

  get searchedTokens() {
    const search = this.search;
    const tokens = this.tokens;
    return search
      ? tokens.filter(token =>
          token.symbol.toLowerCase().includes(search.toLowerCase())
        )
      : tokens;
  }

  get darkMode(): boolean {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
