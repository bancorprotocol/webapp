<script lang="ts">
import { Pie, mixins } from "vue-chartjs-typescript";
import { Component, Vue, Prop } from "vue-property-decorator";

const { reactiveProp } = mixins;

@Component({
  extends: Pie,
  mixins: [reactiveProp]
})
export default class PieChart extends Vue {
  @Prop()
  chartData!: Chart.ChartData;

  @Prop({ default: {} })
  options!: Chart.ChartOptions;

  public renderChart!: (
    chartData: Chart.ChartData,
    options: Chart.ChartOptions
  ) => void;

  mounted() {
    this.renderChart(this.chartData, this.options);
  }
}
</script>
