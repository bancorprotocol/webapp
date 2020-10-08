<template>
  <content-block
    title="Stake"
    :shadow="true"
    :back-button="true"
    @back="back"
    class="mb-3"
  >
    <div class="mt-3">
      <gray-border-block
        v-for="option in stakeOptions"
        :key="option.id"
        :class="option.id <= stakeOptions.length ? 'mb-3' : ''"
      >
        <h5 class="font-size-12 font-w500 text-uppercase mb-2">
          {{ option.title }}
        </h5>
        <p class="font-size-14 font-w400 mb-3">
          {{ option.desc }}
        </p>
        <main-button
          @click="openModal(option.id)"
          :label="option.buttonTxt"
          :active="option.buttonActive"
          :large="true"
          class="mb-2 font-size-14"
        />
      </gray-border-block>

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
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";

@Component({
  components: {
    GrayBorderBlock,
    MainButton,
    ModalPoolSelect,
    ContentBlock
  }
})
export default class AddProtectionHome extends Vue {
  modal = false;

  version: 1 | 2 | null = null;

  stakeOptions = [
    {
      id: 0,
      title: "Protect Single Token",
      desc:
        "Add liquidity with one reserve, be exposed to it only and protect it from impermanent loss.",
      buttonTxt: "Stake & protect token",
      buttonActive: true
    },
    {
      id: 1,
      title: "Protect Pool Token",
      desc:
        "Stake pool tokens of any 50/50 pool holding BNT to protect them from impermanent loss.",
      buttonTxt: "Stake pool token",
      buttonActive: false
    }
  ];

  get pools() {
    if (this.version === 2) return vxm.bancor.relays.filter(x => x.v2);
    else if (this.version === 1) return vxm.bancor.relays.filter(x => !x.v2);
    else return vxm.bancor.relays;
  }

  openModal(optionId: number) {
    if (optionId === 0) {
      this.version = 2;
    } else if (optionId === 1) {
      this.version = 1;
    } else if (optionId === 2) {
      this.version = null;
    }
    this.modal = true;
  }

  selectPool(id: string) {
    this.$router.push({
      name: "ProtectionAction",
      params: { action: "add", id }
    });
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
