<template>
  <line-chart
    :styles="myStyles"
    :chart-data="data"
    :options="dataoptions"
  ></line-chart>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import LineChart from "./LineChart.vue";
import Chart from "chart.js";
import numeral from "numeral";

@Component({
  components: {
    LineChart
  }
})
export default class LiquidityChart extends Vue {
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
            callback: value => `${numeral(value).format("0,0")} BNT`
          },
          position: "right"
        }
      ],
      xAxes: [
        {
          type: "time",
          time: {
            displayFormats: {
              week: "ll"
            },
            tooltipFormat: "ll"
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
      callbacks: {
        label: item => {
          return `${numeral(item.value!).format("0,0")} BNT`;
        }
      },
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
