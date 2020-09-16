<script lang="ts">
import { Bar, mixins } from "vue-chartjs-typescript";
import { Component, Vue, Watch, Prop } from "vue-property-decorator";

const { reactiveProp } = mixins;

@Component({
  extends: Bar,
  mixins: [reactiveProp]
})
export default class BarChart extends Vue {
  @Prop()
  chartData: any;

  @Prop({
    default: function() {
      return {};
    }
  })
  options!: object;

  public renderChart!: (chartData: any, options: any) => void;

  mounted() {
    this.renderChart(this.chartData, this.options);
  }
}
</script>
