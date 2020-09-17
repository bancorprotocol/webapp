<template>
  <bar-chart
    :styles="myStyles"
    :chart-data="data"
    :options="dataoptions"
  ></bar-chart>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import BarChart from "@/components/data/charts/BarChart.vue";
import Chart from "chart.js";
import numeral from "numeral";

@Component({
  components: {
    BarChart
  }
})
export default class VolumeChart extends Vue {
  @Prop() data!: Chart.ChartData;

  dataoptions: Chart.ChartOptions = {
    scales: {
      yAxes: [
        {
          display: true,
          gridLines: {
            display: true,
            drawBorder: true,
            drawOnChartArea: false,
            drawTicks: false
          },
          ticks: {
            padding: 10,
            autoSkip: true,
            maxTicksLimit: 4,
            callback: function(value) {
              return numeral(value).format("$0a");
            }
          },
          position: "right"
        }
      ],
      xAxes: [
        {
          type: "time",
          time: {
            unit: "month"
          },
          display: true,
          gridLines: {
            display: true,
            drawBorder: true,
            drawOnChartArea: false,
            drawTicks: false
          },
          ticks: {
            padding: 10,
            autoSkip: true,
            maxTicksLimit: 3,
            maxRotation: 0,
            minRotation: 0
          }
        }
      ]
    },
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false
    },
    hover: {
      mode: "nearest",
      intersect: true
    },

    legend: {
      display: false
    }
  };
  myStyles = {
    height: "200px",
    position: "relative"
  };
}
</script>

<style></style>
