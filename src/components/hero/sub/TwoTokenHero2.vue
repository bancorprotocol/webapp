<template>
  <div>
    <b-row>
      <b-col md="12" cols="mt-2">
        <token-field
          :tokenId.sync="idOne"
          :symbol="tokenOneMeta.symbol"
          :amount.sync="amountOne"
          :clickable="tokenOneClickable"
          @clicked="tokenOneClicked"
          :balance="tokenOneMeta.balance"
          :img="tokenOneMeta.img"
          :choices="tokenOneMeta.choices"
          :input-label="inputLabels[0]"
          :label="label"
          :errors="tokenOneMeta.errors"
          :warnBalance="warnBalance"
        />
      </b-col>
    </b-row>

    <b-row>
      <b-col class="text-center">
        <slot name="icon"></slot>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="12" class="mb-3">
        <token-field
          :tokenId.sync="idTwo"
          :symbol="tokenTwoMeta.symbol"
          :amount.sync="amountTwo"
          :clickable="tokenTwoClickable"
          @clicked="tokenTwoClicked"
          :balance="tokenTwoMeta.balance"
          :img="tokenTwoMeta.img"
          :choices="tokenTwoMeta.choices"
          :input-label="inputLabels[1]"
          :label="label"
          :errors="tokenTwoMeta.errors"
          :warnBalance="warnBalance"
        />
      </b-col>
    </b-row>

    <b-row>
      <b-col md="12" class="d-flex justify-content-center align-items-center">
        <slot></slot>
      </b-col>
    </b-row>
  </div>
</template>
<script lang="ts">
import {
  Watch,
  Prop,
  Component,
  Vue,
  Emit,
  PropSync
} from "vue-property-decorator";
import { vxm } from "@/store";
import TokenField from "@/components/convert/TokenField.vue";
import SubNavigation from "@/components/layout/SubNavigation.vue";
import ContentBlock from "@/components/common/ContentBlock.vue";

interface TokenMeta {
  balance?: number;
  symbol: string;
  errors?: string[];
  img: string;
  choices?: any[];
}

@Component({
  components: {
    ContentBlock,
    SubNavigation,
    TokenField
  }
})
export default class TwoTokenHero2 extends Vue {
  @PropSync("tokenOneId", { type: String }) idOne!: string;
  @PropSync("tokenOneAmount", { type: String }) amountOne!: string;
  @Prop(Object) tokenOneMeta!: TokenMeta;

  @PropSync("tokenTwoId", { type: String }) idTwo!: string;
  @PropSync("tokenTwoAmount", { type: String }) amountTwo!: string;
  @Prop(Object) tokenTwoMeta!: TokenMeta;

  @Prop(String) label?: string;
  @Prop(Array) inputLabels!: string[];
  @Prop(Array) choices?: any[];
  @Prop({ default: false }) warnBalance?: boolean;

  modal = false;

  @Emit()
  tokenOneClicked() {}

  @Emit()
  tokenTwoClicked() {}

  get darkMode() {
    return vxm.general.darkMode;
  }

  get tokenOneChoices() {
    return this.tokenOneMeta.choices;
  }

  get tokenTwoChoices() {
    return this.tokenTwoMeta.choices;
  }

  get tokenOneClickable() {
    return (
      (this.tokenOneChoices && this.tokenOneChoices.length > 0) ||
      (this.choices && this.choices.length > 0)
    );
  }

  get tokenTwoClickable() {
    return (
      (this.tokenTwoChoices && this.tokenTwoChoices.length > 0) ||
      (this.choices && this.choices.length > 0)
    );
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
  transform: translateY(75px);
  opacity: 0;
}
.slide-fade-up-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-75px);
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
  transform: translateY(-75px);
  opacity: 0;
}
.slide-fade-down-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(75px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
