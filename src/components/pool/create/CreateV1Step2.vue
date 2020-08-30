<template>
  <b-row>
    <b-col cols="12" class="mb-3">
      <multi-input-field
        v-model="stepTwoProps.poolName"
        label="Pool Name"
        placeholder="eg. BNTDMG Smart Relay"
        height="48"
      />
    </b-col>
    <b-col cols="6">
      <multi-input-field
        v-model="stepTwoProps.poolSymbol"
        label="Pool Symbol"
        placeholder="eg. BNTDMG"
        height="48"
      />
    </b-col>
    <b-col cols="6">
      <multi-input-field
        v-model="stepTwoProps.poolDecimals"
        type="number"
        label="Pool Decimals"
        placeholder="eg. 18"
        height="48"
      />
    </b-col>
    <b-col cols="12" class="mt-3">
      <multi-input-field
        v-model="stepTwoProps.poolFee"
        label="Fee"
        placeholder="eg. 0.02"
        height="48"
        append="%"
      />
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";
import MultiInputField from "@/components/common/MultiInputField.vue";
import { ViewToken } from "@/types/bancor";
import { VModel } from "@/api/helpers";
import { CreateStep1, CreateStep2 } from "@/views/CreateHomeNew.vue";

@Component({
  components: { MultiInputField }
})
export default class CreateV1Step2 extends Vue {
  @VModel() stepTwoProps!: CreateStep2;
}
</script>
<style lang="scss"></style>
