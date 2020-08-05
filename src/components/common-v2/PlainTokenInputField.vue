<template>
  <div>
    <label-content-split :label="label" class="mb-1">
      <span v-if="typeof balance !== 'undefined'" class="font-size-12 font-w500"
        >Balance: {{ balance }} {{ usdValue && "(~$??.??)" }}</span
      >
    </label-content-split>
    <b-input-group>
      <b-form-input
        type="text"
        debounce="500"
        v-model="tokenAmount"
        :class="darkMode ? 'form-control-alt-dark' : 'form-control-alt-light'"
        placeholder="Enter Amount"
      ></b-form-input>
      <b-input-group-append>
        <div
          class="rounded-right d-flex align-items-center px-2"
          :class="darkMode ? 'bg-body-dark' : 'bg-light'"
        >
          <div v-if="logo && symbol" class="d-flex align-items-center">
            <img
              class="img-avatar img-avatar32 border-colouring bg-white mr-1"
              :src="logo"
              alt="Token Logo"
            />
            <span
              class="px-1 font-size-14 font-w600"
              :class="darkMode ? 'text-dark' : 'text-light'"
              >{{ symbol }}</span
            >
          </div>
        </div>
      </b-input-group-append>
    </b-input-group>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, PropSync } from "vue-property-decorator";
import { vxm } from "@/store/";
import { ViewRelay, ViewReserve } from "@/types/bancor";
import LabelContentSplit from "@/components/common-v2/LabelContentSplit.vue";

@Component({
  components: { LabelContentSplit }
})
export default class TokenInputField extends Vue {
  @Prop() label!: string;
  @Prop() usdValue?: number;
  @Prop() logo!: string;
  @Prop() symbol!: string;
  @Prop() balance!: string;
  @Prop() disabled!: boolean;
  @PropSync("amount", { type: String }) tokenAmount!: string;

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
