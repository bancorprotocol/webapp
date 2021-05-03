<template>
  <div>
    <alert-block class="my-3" variant="info" :msg="$t('pools_with_two')" />

    <div v-for="(props, index) in stepOneProps" :key="index">
      <create-v1-token-block
        v-model="props.token"
        :percentage.sync="props.percentage"
        :type="index ? 'primary' : 'secondary'"
        @remove="removeToken"
      />
      <font-awesome-icon
        v-if="index + 1 !== stepOneProps.length"
        icon="plus"
        class="my-3"
      />
      <div
        @click="addToken"
        v-else-if="stepOneProps[stepOneProps.length - 1].token"
        class="font-size-12 font-w500 text-right mt-3"
        :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
      >
        <span class="cursor">+ {{ $t("add_another_token") }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, VModel } from "vue-property-decorator";
import CreateV1TokenBlock from "./CreateV1TokenBlock.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";
import { CreateStep1 } from "@/views/CreateHome.vue";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: {
    CreateV1TokenBlock,
    AlertBlock
  }
})
export default class CreateV1Step1 extends BaseComponent {
  @VModel() stepOneProps!: CreateStep1[];

  addToken() {
    this.stepOneProps.push({ token: null, percentage: "50" });
  }

  removeToken(id: string) {
    let index = this.stepOneProps.findIndex(x => x.token && x.token.id === id);
    if (index > -1) {
      this.stepOneProps.splice(index, 1);
    }
  }
}
</script>
<style lang="scss">
@import "../../../assets/_scss/custom/variables";
</style>
