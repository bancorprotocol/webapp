<template>
  <b-card>
    <h3>SimpleComp</h3>
    <div>{{msg}}</div>
    <simple-child-comp @click="onClick" />
    <p>{{renderTxt}}</p>
    <div class="div-show">
      <div v-if="isShow">SHOW</div>
    </div>
    <div class="div-bg" style="width: 200px">
      DIV-BG
    </div>
    <div class="div-ip">
      <input type="text" />
    </div>    
  </b-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SimpleChildComp from "./SimpleChildComp.vue";

@Component({
  components: { SimpleChildComp }
})
export default class TestWorld extends Vue {
  @Prop() private msg!: string;
  @Prop() private isShow: boolean = true;

  renderTxt: string = "";
  
  onClick(param: string) {
    this.renderTxt = param;
    console.log('fff', param)
  }    
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
