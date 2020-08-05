<template>
  <b-row class="d-flex align-items-center justify-content-center">
    <div v-if="!(txBusy || success || error)">
      <token-block
        :title="leftHeader"
        :img="leftImg"
        :tokenAmount="leftTitle"
        :tokenName="leftSubtitle"
      />
      <b-col cols="12">
        <slot name="icon"></slot>
      </b-col>
      <token-block
        :title="rightHeader"
        :img="rightImg"
        :tokenAmount="rightTitle"
        :tokenName="rightSubtitle"
      />
      <b-col cols="12">
        <p
          class="font-size-sm font-w400 text-center mt-1 mb-2"
          :class="!darkMode ? 'text-muted-light' : 'text-muted-dark'"
        >
          Output is estimated. If the price changes by more than 0.5% your
          transaction will revert.
        </p>
      </b-col>
    </div>

    <slot name="footer"></slot>
  </b-row>
</template>
<script lang="ts">
import { Watch, Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";
import { TokenPrice } from "@/types/bancor";
import numeral from "numeral";
import TokenBlock from "@/components/common/TokenBlock.vue";

@Component({
  components: {
    TokenBlock
  }
})
export default class LiquidityActions extends Vue {
  @Prop() error!: string;
  @Prop() success!: string;
  @Prop({ default: false }) txBusy!: boolean;

  @Prop() leftImg!: string;
  @Prop() leftTitle!: string;
  @Prop() leftSubtitle!: string;
  @Prop({ default: "Send" }) leftHeader!: string;

  @Prop() rightImg!: string;
  @Prop() rightTitle!: string;
  @Prop() rightSubtitle!: string;
  @Prop({ default: "Receive" }) rightHeader!: string;

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped></style>
