<template>
  <div>
    <span class="font-size-sm">
      <div>
        <span v-if="loading">
          <font-awesome-icon icon="circle-notch" spin />
        </span>
        <span v-else> {{ label }} {{ balance }}</span>
      </div>
    </span>
  </div>
</template>
<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";

@Component({})
export default class TokenAmountInput extends Vue {
  @Prop(String) balance!: string;
  @Prop(Boolean) loading?: boolean;
  @Prop({ default: "Balance:" }) readonly label!: string;
}
</script>

<style lang="scss" scoped></style>
