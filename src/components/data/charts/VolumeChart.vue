<template>
  <bar-chart
    :styles="myStyles"
    :chart-data="datacollection"
    :options="dataoptions"
  ></bar-chart>
</template>

<script>
import BarChart from "@/components/data/charts/BarChart";

export default {
  components: {
    BarChart
  },
  data() {
    return {
      datacollection: null,
      dataoptions: {
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
                maxTicksLimit: 4
              },
              position: "right"
            }
          ],
          xAxes: [
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
      },
      myStyles: {
        height: "200px",
        position: "relative"
      }
    };
  },
  mounted() {
    this.fillData();
  },
  methods: {
    fillData() {
      this.datacollection = {
        labels: [
          this.getRandomInt(),
          this.getRandomInt(),
          this.getRandomInt(),
          this.getRandomInt(),
          this.getRandomInt(),
          this.getRandomInt(),
          this.getRandomInt(),
          this.getRandomInt()
        ],
        datasets: [
          {
            label: "Date",
            backgroundColor: "#0f59d1",
            borderColor: "#0f59d1",
            borderWidth: 0,
            pointRadius: 0,
            data: [
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt()
            ]
          }
        ]
      };
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    }
  }
};
</script>

<style></style>
