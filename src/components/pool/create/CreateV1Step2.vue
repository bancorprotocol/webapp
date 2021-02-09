<template>
  <b-row>
    <b-col cols="12" class="mb-3">
      <multi-input-field
        v-model="stepTwoProps.poolName"
        :label="$t('pool_name')"
        placeholder="eg. BNTDMG Smart Relay"
        height="48"
      />
    </b-col>
    <b-col cols="6">
      <multi-input-field
        v-model="stepTwoProps.poolSymbol"
        :label="$t('token_symbol')"
        placeholder="eg. BNTDMG"
        height="48"
      />
    </b-col>
    <b-col cols="6">
      <multi-input-field
        v-model="stepTwoProps.poolDecimals"
        type="number"
        :label="$t('pool_decimals')"
        placeholder="eg. 18"
        height="48"
      />
    </b-col>
    <b-col cols="12" class="mt-3">
      <multi-input-field
        v-model="stepTwoProps.poolFee"
        :label="$t('fee')"
        placeholder="eg. 0.02"
        height="48"
        append="%"
      />
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Component, Vue, VModel } from "vue-property-decorator";
import MultiInputField from "@/components/common/MultiInputField.vue";
import { CreateStep2 } from "@/views/CreateHome.vue";

@Component({
  components: { MultiInputField }
})
export default class CreateV1Step2 extends Vue {
  @VModel() stepTwoProps!: CreateStep2;
}
</script>
<style lang="scss"></style>
