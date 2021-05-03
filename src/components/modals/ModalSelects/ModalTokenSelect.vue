<template>
  <modal-select
    v-model="show"
    :search.sync="search"
    :items="searchedTokens"
    :title="$t('select_token')"
    :subtitle="$t('tokens')"
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
            :alt="$t('token_logo')"
          />
          <span class="font-w600 font-size-14">{{ item.symbol }}</span>
        </div>
        <span v-if="item.balance" class="font-w500 font-size-12">{{
          formattedBalance(item.balance)
        }}</span>
      </div>
    </template>
    <template v-if="allowTokenAdd" #footer>
      <p class="mb-0">{{ $t("cant_find_token") }}</p>
      <span
        @click="promptTokenAddModal"
        class="cursor font-w600"
        :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
      >
        {{ $t("add_token") }}
      </span>
      <modal-base :title="$t('add_token')" v-model="addTokenModal">
        <multi-input-field
          v-model="addTokenText"
          @input="onTokenInput"
          :label="$t('token_address')"
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
import { i18n } from "@/i18n";
import ModalSelect from "@/components/modals/ModalSelects/ModalSelect.vue";
import ModalBase from "@/components/modals/ModalBase.vue";
import MultiInputField from "@/components/common/MultiInputField.vue";
import { ViewModalToken } from "@/types/bancor";
import { compareString, formatNumber } from "@/api/helpers";
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
    try {
      const { tokenAddress } = await vxm.ethBancor.addToken(this.addTokenText);
      this.error = "";
      this.addTokenModal = false;

      if (tokenAddress) {
        const token = this.tokens.find((t: ViewModalToken) =>
          compareString(t.id, tokenAddress)
        );
        if (token) this.selectToken(token.id);
        else this.error = `${i18n.tc("token_not_found")}.`;
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
