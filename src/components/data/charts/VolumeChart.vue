<template>
  <line-chart
    :styles="myStyles"
    :chart-data="datacollection"
    :options="dataoptions"
  ></line-chart>
</template>

<script>
import LineChart from "./LineChart";

export default {
  components: {
    LineChart
  },
  data() {
    return {
      datacollection: null,
      dataoptions: {
        scales: {
          yAxes: [
            {
              display: false,
              gridLines: false,
              ticks: {
                beginAtZero: true
              }
            }
          ],
          xAxes: [
            {
              display: false,
              gridLines: false
            }
          ]
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        }
      },
      myStyles: {
        height: "180px",
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
            label: "Data One",
            backgroundColor: "rgba(15, 89, 209, 0.2)",
            borderColor: ["#0f59d1"],
            borderWidth: 2,
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
