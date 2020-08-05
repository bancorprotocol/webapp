<template>
  <div>
    <div v-if="label" class="content">
      <h5>{{ label }}</h5>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Avatar from "vue-avatar";

@Component({
  components: { Avatar }
})
export default class Stepper extends Vue {
  @Prop() steps!: any[];
  @Prop(Number) selectedStep!: number;
  @Prop({ default: false }) numbered?: boolean;
  @Prop(String) label?: string;
}
</script>

<style scoped lang="scss">
.content {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.row {
  min-height: 50vh;
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

.steps {
  display: flex;
  justify-content: space-evenly;
}

.step {
  margin-right: 10px;
}
</style>
