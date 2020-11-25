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
    <template v-if="allowTokenAdd" #footer>
      <p class="mb-0">Can't find the token you're looking for?</p>
      <span @click="promptTokenAddModal" class="text-primary cursor font-w600">
        Add token
      </span>
      <modal-base title="Add Token" v-model="addTokenModal">
        <multi-input-field
          v-model="addTokenText"
          @input="onTokenInput"
          label="Token Address"
          placeholder="eg. 0x90feoiw..."
          height="48"
        />
        {{ error }}
      </modal-base>
    </template>
  </modal-select>
</template>

<script lang="ts">
import { Component, Prop, Emit, VModel } from "vue-property-decorator";
import { vxm } from "@/store";
import ModalSelect from "@/components/modals/ModalSelects/ModalSelect.vue";
import ModalBase from "@/components/modals/ModalBase.vue";
import MultiInputField from "@/components/common/MultiInputField.vue";
import { ViewModalToken } from "@/types/bancor";
import { formatNumber } from "@/api/helpers";
import MainButton from "@/components/common/Button.vue";
import { isAddress } from "web3-utils";
import BaseComponent from "@/components/BaseComponent.vue";

const INVALID_ADDRESS = "Invalid address";

@Component({
  components: { ModalSelect, MainButton, MultiInputField, ModalBase }
})
export default class ModalSelectToken extends BaseComponent {
  @VModel() show!: boolean;
  @Prop() tokens!: ViewModalToken[];
  @Prop({ default: false }) allowTokenAdd!: boolean;

  search: string = "";
  addTokenModal: boolean = false;
  addTokenText: string = "";
  error: string = "";

  get isEos() {
    return this.currentNetwork === "eos";
  }

  @Emit("select")
  selectToken(id: string) {
    this.show = false;
    return id;
  }

  onTokenInput(input: string) {
    if (isAddress(input)) {
      this.error = "";
      this.triggerAdd();
    } else {
      if (this.error !== INVALID_ADDRESS) {
        this.error = INVALID_ADDRESS;
      }
    }
  }

  promptTokenAddModal() {
    if (this.isEos)
      window.open("https://github.com/eoscafe/eos-airdrops/", "_blank");
    else this.addTokenModal = true;
  }

  async triggerAdd() {
    const tokenAddress = this.addTokenText;
    try {
      const { symbol } = await vxm.ethBancor.addToken(tokenAddress);
      this.error = "";
      this.addTokenModal = false;

      if (symbol) {
        const token = this.tokens.find(
          (t: ViewModalToken) => t.symbol === symbol
        );
        if (token) this.selectToken(token.id);
        else this.error = "Token not found.";
      }
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
}
</script>

<style scoped lang="scss"></style>
