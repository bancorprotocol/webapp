<template>
  <div>add protection v2</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";
import { ViewRelay } from "@/types/bancor";

@Component({
  components: {}
})
export default class AddProtectionV2 extends Vue {
  @Prop() pool!: ViewRelay;

  amount: string = "";

  created() {}
}
</script>

<style scoped lang="scss"></style>
