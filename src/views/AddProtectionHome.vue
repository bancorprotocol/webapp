<template>
  <content-block
    title="Stake"
    :shadow="true"
    :back-button="true"
    @back="back"
    class="mb-3"
  >
    <div class="mt-3">
      <main-button
        @click="openModal('v2')"
        label="I want to stake token"
        :active="true"
        :large="true"
        class="mb-3"
      />

      <main-button
        @click="openModal('v1')"
        label="I want to stake pool token"
        :active="false"
        :large="true"
      />

      <modal-pool-select @select="selectPool" v-model="modal" :pools="pools" />
    </div>
  </content-block>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import MainButton from "@/components/common/Button.vue";
import ModalPoolSelect from "@/components/modals/ModalSelects/ModalPoolSelect.vue";

@Component({
  components: {
    MainButton,
    ModalPoolSelect,
    ContentBlock
  }
})
export default class AddProtectionHome extends Vue {
  modal = false;

  version: "v1" | "v2" | null = null;

  get pools() {
    if (this.version === "v2") return vxm.bancor.relays.filter(x => x.v2);
    else return vxm.bancor.relays.filter(x => !x.v2);
  }

  openModal(version: "v1" | "v2") {
    this.version = version;
    this.modal = true;
  }

  selectPool(id: string) {
    this.$router.push({
      name: "ProtectionAction",
      params: { action: "add", id }
    });
    this.modal = false;
  }

  back() {
    this.$router.push({ name: "LiqProtection" });
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
