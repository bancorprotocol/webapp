<template>
  <div>
    <gray-border-block v-if="token">
      <select-token-block
        :type="type"
        v-model="token"
        @remove="removeToken"
        class="mt-2"
      />
      <percentage-slider
        class="mt-3"
        label="Token Reserve Ratio"
        v-model="percent"
        :disabled="true"
      />
    </gray-border-block>
    <select-token-block v-else v-model="token" :type="type" />
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, PropSync, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import SelectTokenBlock from "@/components/common/SelectTokenBlock.vue";
import PercentageSlider from "@/components/common/PercentageSlider.vue";
import { VModel } from "@/api/helpers";
import { ViewModalToken, ViewToken } from "@/types/bancor";

@Component({
  components: {
    PercentageSlider,
    GrayBorderBlock,
    SelectTokenBlock
  }
})
export default class CreateV1TokenBlock extends Vue {
  @Prop() type?: "primary" | "secondary";
  @VModel() token?: ViewToken;
  @PropSync("percentage", { type: String }) percent!: string;

  @Emit("remove")
  removeToken() {
    return this.token!.id;
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>
<style lang="scss">
@import "../../../assets/_scss/custom/variables";
</style>
