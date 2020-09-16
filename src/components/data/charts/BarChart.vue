<script lang="ts">
import { Bar, mixins } from "vue-chartjs-typescript";
import { Component, Vue, Prop } from "vue-property-decorator";

const { reactiveProp } = mixins;

@Component({
  extends: Bar,
  mixins: [reactiveProp]
})
export default class BarChart extends Vue {
  @Prop()
  chartData!: Chart.ChartData;

  @Prop({ default: {} })
  options!: Chart.ChartOptions;

  public renderChart!: (chartData: any, options: any) => void;

  mounted() {
    this.renderChart(this.chartData, this.options);
  }
}
</script>
