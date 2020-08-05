<template>
  <b-col md="12" class="d-flex justify-content-between align-items-center">
    <h4 v-if="false" class="text-uppercase text-muted">{{ title }}</h4>

    <h6
      class="m-0 p-0"
      :class="darkMode ? 'text-body-dark' : 'text-body-light'"
    >
      {{ tokenAmount }}
    </h6>
    <div class="d-flex align-items-center">
      <h4 class="text-muted m-0 p-0">
        {{ tokenName }}
      </h4>
      <img
        class="img-avatar img-avatar32 img-avatar-thumb ml-3"
        :src="img"
        alt="Token Logo"
      />
    </div>
  </b-col>
</template>
<script lang="ts">
import { Watch, Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";
import { TokenPrice } from "@/types/bancor";
import numeral from "numeral";

@Component
export default class TokenBalanceBlock extends Vue {
  @Prop() title!: string;
  @Prop() img!: string;
  @Prop() tokenAmount!: string;
  @Prop() tokenName!: string;

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped></style>
