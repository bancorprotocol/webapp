<template>
  <div>
    <h3>SimpleChildComp</h3>
    <button @click="actionClick()">Click</button>    
  </div>
</template>

<script lang="ts">
import { Component, Emit, Vue } from "vue-property-decorator";

@Component
export default class TestWorld extends Vue {  

  renderTxt: string = "";

  @Emit("click")
  actionClick() {    
    return 'clicked';
  }  
}
</script>
