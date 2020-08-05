<template>
  <span>
    <transition
      :name="invertAnimation ? `slide-fade-up` : `slide-fade-down`"
      mode="out-in"
    >
      <token-amount-input
        :key="currentId"
        :amount.sync="tokenAmount"
        :balance="balance"
        :img="img"
        :symbol="symbol"
        :dropdown="clickable"
        :inputLabel="inputLabel"
        :label="label"
        :input-label="inputLabel"
        @dropdown="clicked"
        @click="clicked"
        :warnBalance="warnBalance"
        :error="error"
        :errors="errors"
      />
    </transition>
    <modal-select
      v-if="choices && choices.length > 0"
      v-model="modal"
      :tokens="choices"
      @onSelect="selectChoice"
    />
  </span>
</template>
<script lang="ts">
import {
  Prop,
  Component,
  Vue,
  PropSync,
  Watch,
  Emit
} from "vue-property-decorator";
import { vxm } from "@/store";
import ModalSelect from "@/components/modals/ModalSelect.vue";
import TokenAmountInput from "@/components/convert/TokenAmountInput.vue";

@Component({
  components: {
    ModalSelect,
    TokenAmountInput
  }
})
export default class TokenField extends Vue {
  @PropSync("amount", { type: String }) tokenAmount!: string;
  @PropSync("tokenId", { type: String }) currentId!: string;
  @Prop({ default: 0 }) balance!: number;
  @Prop(Boolean) loading?: boolean;
  @Prop({ default: "Balance:" }) readonly label!: string;
  @Prop(String) readonly inputLabel!: string;
  @Prop(String) img!: string;
  @Prop(String) symbol!: string;
  @Prop(Boolean) invertAnimation?: boolean;
  @Prop({ default: false }) readonly clickable?: boolean;
  @Prop(Array) readonly choices?: any[];
  @Prop(String) error?: string;
  @Prop(Array) errors?: string[];
  @Prop({ default: false }) warnBalance?: boolean;

  modal = false;

  @Emit()
  clicked() {
    this.modal = true;
  }

  selectChoice(id: string) {
    this.modal = false;
    this.currentId = id;
  }
}
</script>

<style lang="scss" scoped></style>
