<template>
  <div class="parent container-fluid">
    <div
      class="content container-fluid d-flex flex-column align-items-center w-100"
    >
      <font-awesome-icon
        icon="poo"
        class="fa-2x text-black cursor"
        size="10x"
      />
      <h1>That's a 404</h1>
      <p>
        Page not found.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";

@Component
export default class PageNotFound extends Vue {}
</script>

<style lang="scss" scoped>
.parent {
  margin: 20px;
  max-width: 80%;
  display: flex;
  align-self: center;
}

.content {
  background-color: white;
  padding: 15px;
  min-width: 100px;
}

.wrapper {
  padding: 20px;
}

.text {
  color: white;
}

.orange {
  color: #d18235;
}
</style>
