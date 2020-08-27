<template>
  <div>
    <alert-block
      class="my-3"
      variant="info"
      msg="In Bancor V1 total reserve of the pool you create should be less or equal 100%."
    />

    <create-v1-token-block
      v-model="stepOneProps.token1"
      :percentage.sync="stepOneProps.percentage1"
      type="secondary"
    />
    <font-awesome-icon icon="plus" class="my-3" />
    <create-v1-token-block
      v-model="stepOneProps.token2"
      :percentage.sync="stepOneProps.percentage2"
      type="primary"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";
import CreateV1TokenBlock from "./CreateV1TokenBlock.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";
import { ViewToken } from "@/types/bancor";
import { VModel } from "@/api/helpers";
import { CreateStep1 } from "@/views/CreateHomeNew.vue";

@Component({
  components: {
    CreateV1TokenBlock,
    AlertBlock
  }
})
export default class CreateV1Step1 extends Vue {
  @VModel() stepOneProps!: CreateStep1;

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>
<style lang="scss">
@import "../../../assets/_scss/custom/variables";
</style>
