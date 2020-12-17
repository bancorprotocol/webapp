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
      />
    </gray-border-block>
    <select-token-block v-else v-model="token" :type="type" />
  </div>
</template>

<script lang="ts">
import {
  Emit,
  Prop,
  PropSync,
  VModel
} from "vue-property-decorator";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import SelectTokenBlock from "@/components/common/SelectTokenBlock.vue";
import PercentageSlider from "@/components/common/PercentageSlider.vue";
import { ViewToken } from "@/types/bancor";
import BaseComponent from "@/components/BaseComponent.vue";
import { Options } from "vue-class-component/dist/vue-class-component"

@Options({
  components: {
    PercentageSlider,
    GrayBorderBlock,
    SelectTokenBlock
  }
})
export default class CreateV1TokenBlock extends BaseComponent {
  @Prop() type?: "primary" | "secondary";
  @VModel() token?: ViewToken;
  @PropSync("percentage", { type: String }) percent!: string;

  @Emit("remove")
  removeToken() {
    return this.token!.id;
  }
}
</script>
<style lang="scss">
@import "../../../assets/_scss/custom/variables";
</style>
