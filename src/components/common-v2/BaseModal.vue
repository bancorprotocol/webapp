<template>
  <b-modal
    :id="id"
    scrollable
    :size="size"
    centered
    hide-footer
    :content-class="darkMode ? 'bg-block-dark' : 'bg-block-light'"
    @close="onHide"
    @cancel="onHide"
    @hide="onHide"
  >
    <template slot="modal-header">
      <span
        class="font-size-14 font-w600"
        :class="darkMode ? 'text-dark' : 'text-light'"
        >{{ title }}</span
      >
      <font-awesome-icon
        class="cursor font-size-lg"
        :class="darkMode ? 'text-dark' : 'text-light'"
        @click="$bvModal.hide(id)"
        icon="times"
      />
    </template>

    <slot></slot>
  </b-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";

@Component({
  components: {}
})
export default class BaseModal extends Vue {
  @Prop() id!: string;
  @Prop() title!: string;
  @Prop({ default: "md" }) size!: "sm" | "md" | "lg";

  tokenSearch: string = "";

  get darkMode(): boolean {
    return vxm.general.darkMode;
  }

  onHide(event: any) {
    this.$emit("on-hide-modal");
  }

  created() {}
}
</script>
<style lang="scss">
.modal-body {
  padding-top: 0 !important;
}
</style>
