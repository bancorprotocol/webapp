<template>
  <div>
    <alert-block
      class="my-3"
      variant="info"
      msg="Pools with 2 reserves and 50/50 weight can be voted for protection."
    />

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
        class="font-size-12 font-w500 text-primary text-right mt-3"
      >
        <span class="cursor">+ Add another token</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import CreateV1TokenBlock from "./CreateV1TokenBlock.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";
import { VModel } from "@/api/helpers";
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
