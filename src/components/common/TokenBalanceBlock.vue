<template functional>
  <div
    class="block block-rounded cursor"
    :class="props.dark ? 'bg-body-dark' : 'bg-body-light'"
  >
    <div class="block-content d-flex align-items-center p-3">
      <div class="cursor">
        <img
          class="img-avatar img-avatar-thumb img-avatar48 bg-white"
          :src="props.img"
          alt="Token Logo"
        />
      </div>
      <div class="ml-3 text-left cursor">
        <h3
          class="mb-0 mt-0"
          :class="props.dark ? 'text-body-dark' : 'text-body-light'"
        >
          {{ props.symbol }}
        </h3>
        <h5
          class="mb-0 mt-0"
          :class="dark ? 'text-body-dark' : 'text-body-light'"
        >
          <span class="font-size-sm">{{ props.balance }}</span>
        </h5>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class TokenBalanceBlock extends Vue {
  @Prop() symbol!: string;
  @Prop() img!: string;
  @Prop() balance!: string;
  @Prop({ default: false }) dark!: boolean;
  @Prop() v2!: boolean;
}
</script>

<style scoped></style>
