<template>
  <div class="mt-3">
    <gray-border-block
      v-for="option in stakeOptions"
      :key="option.id"
      :class="option.id <= stakeOptions.length ? 'mb-3' : ''"
    >
      <h5
        class="font-size-14 font-w600 text-uppercase my-2"
        :class="darkMode ? 'text-white' : 'text-primary'"
      >
        {{ option.title }}
      </h5>
      <p class="font-size-14 font-w400 mb-3">
        {{ option.desc }}
      </p>
      <main-button
        @click="openModal(option.id)"
        :label="option.buttonTxt"
        :active="option.buttonEnabled"
        :large="true"
        :disabled="!option.buttonEnabled"
        class="mb-2 font-size-14"
      />
    </gray-border-block>

    <modal-pool-select @select="selectPool" v-model="modal" :pools="pools" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import MainButton from "@/components/common/Button.vue";
import ModalPoolSelect from "@/components/modals/ModalSelects/ModalPoolSelect.vue";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";

@Component({
  components: {
    GrayBorderBlock,
    MainButton,
    ModalPoolSelect
  }
})
export default class AddProtectionHome extends Vue {
  modal = false;

  singleMode: boolean | null = null;

  get phase2() {
    return vxm.general.phase2;
  }

  get stakeOptions() {
    return [
      {
        id: 0,
        title: `Protect Single Token ${this.phase2 ? "" : "(Coming Soon)"}`,
        desc:
          "Add liquidity with one reserve, be exposed to it only and protect it from impermanent loss.",
        buttonTxt: "Stake & protect token",
        buttonActive: true,
        buttonEnabled: this.phase2
      },
      {
        id: 1,
        title: "Protect Pool Token",
        desc:
          "Stake pool tokens of any 50/50 pool holding BNT to protect them from impermanent loss.",
        buttonTxt: "Stake pool token",
        buttonActive: false,
        buttonEnabled: true
      }
    ];
  }

  get pools() {
    return vxm.bancor.relays.filter(pool => pool.whitelisted && !pool.v2);
  }

  openModal(optionId: number) {
    this.singleMode = optionId === 0;
    this.modal = true;
  }

  selectPool(id: string) {
    this.modal = false;
    setTimeout(() => {
      if (this.singleMode) {
        this.$router.push({
          name: "AddProtectionSingle",
          params: { id }
        });
      } else {
        this.$router.push({
          name: "AddProtectionDouble",
          params: { id }
        });
      }
    }, 400);
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
