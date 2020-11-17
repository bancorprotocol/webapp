<template>
  <b-card>
    <h3>SimpleComp</h3>
    <div>{{msg}}</div>
    <!-- <input type="text" @input="actionInput" />
    <button @click="actionClick()">Click</button> -->
  </b-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class TestWorld extends Vue {
  @Prop() private msg!: string;
  
  // actionInput(event) {
  //   const inputValue = event.target.value
  //   if (inputValue === 'input') {
  //     this.$store.dispatch('actionInput', { inputValue })
  //   }
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
