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
        :disabled="true"
        class="mt-3"
        :label="$t('token_reserve_ratio')"
        v-model="percent"
      />
    </gray-border-block>
    <select-token-block v-else v-model="token" :type="type" />
  </div>
</template>

<script lang="ts">
import {
  Component,
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

@Component({
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
