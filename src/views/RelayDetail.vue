<template>
  <b-container class="base">
    <b-row align-v="center">
      <b-col>
        <font-awesome-icon
          icon="arrow-left"
          fixed-width
          @click="goBack"
          :style="{ color: 'black' }"
        />
      </b-col>
      <b-col v-if="!loading" class="text-center align-middle">
        <p class="h3">ROI: {{ performanceLabel }}</p>
      </b-col>
      <b-col v-if="!loading" class="justify-content-end d-flex flex-end">
        <b-dropdown size="sm" :text="selectedMode" class="m-md-2">
          <b-dropdown-item
            :active="option.active"
            v-for="option in options"
            :key="option.label"
            @click="changeOption(option.value)"
            >{{ option.label }}</b-dropdown-item
          >
        </b-dropdown>
      </b-col>
    </b-row>

    <b-row>
      <div :class="classes">
        <b-spinner
          v-if="loading"
          style="display: block; width: 10rem; height: 10rem;"
          class="text-dark"
          label="Loading..."
        ></b-spinner>
        <div v-else>
          <highcharts
            :constructor-type="'stockChart'"
            :options="chartOptions"
          />
        </div>
      </div>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import { SimpleToken, HistoryRow } from "@/types/bancor";
import wait from "waait";
import { Chart } from "highcharts-vue";
import moment from "moment";

import Highcharts, { getOptions, AxisSetExtremesEventObject } from "highcharts";
import stockInit from "highcharts/modules/stock";
import { compareString, findOrThrow } from "../api/helpers";
import { sortByNetworkTokens } from "../api/sortByNetworkTokens";

stockInit(Highcharts);

enum YieldType {
  portfolio = "Both",
  token = "Token",
  network = "Network"
}

@Component({
  components: {
    highcharts: Chart
  }
})
export default class RelayDetail extends Vue {
  loading = true;
  data: HistoryRow[] = [];
  performance = {
    Token: 0,
    Both: 0,
    Network: 0
  };
  type: YieldType = YieldType.portfolio;

  chartOptions = {};

  setRange(minRange: number, maxRange: number) {
    this.updatePerformance(
      this.data.filter(
        row => row.timestamp >= minRange && row.timestamp <= maxRange
      )
    );
  }

  updatePerformance(data: HistoryRow[]) {
    const selectedData = data.sort((a, b) => a.timestamp - b.timestamp);

    let cumulative_dm_roi: any[] = [];
    let loss: any[] = [];
    let net_position: any[] = [];
    let price_ratio;
    let cur_loss: number = 0;
    let cur_price = 0;

    let dm_roi = 1;
    let initial_price = 0;

    selectedData.forEach((data, index, arr) => {
      let { timestamp, roi, tradeVolume, tokenPrice } = data;
      cur_price = tokenPrice;

      if (initial_price == 0) {
        initial_price = tokenPrice;
      }

      dm_roi *= roi;
      price_ratio = tokenPrice / initial_price;
      cur_loss = (2.0 * Math.sqrt(price_ratio)) / (1.0 + price_ratio);

      cumulative_dm_roi.push([
        timestamp,
        parseFloat(((dm_roi - 1) * 100).toFixed(2))
      ]);

      loss.push([timestamp, parseFloat(((cur_loss - 1) * 100).toFixed(2))]);

      net_position.push([
        timestamp,
        parseFloat(((cur_loss * dm_roi - 1) * 100).toFixed(2))
      ]);
    });

    this.performance = {
      Token: ((1 + cur_price / initial_price) * cur_loss * dm_roi) / 2,
      Network: ((1 + initial_price / cur_price) * cur_loss * dm_roi) / 2,
      Both: cur_loss * dm_roi
    };
  }

  changeOption(newType: YieldType) {
    this.type = newType;
  }

  get performanceNumber() {
    return (
      (this.performance[this.type] > 1 ? "+" : "") +
      ((this.performance[this.type] - 1) * 100).toFixed(2)
    );
  }

  get performanceLabel() {
    return `${this.performanceNumber} %`;
  }

  getTokenType(label: string) {
    switch (label) {
      case YieldType.token:
        return "Hodl " + this.token.symbol;
      case YieldType.network:
        return "Hodl " + this.network.symbol;
      case YieldType.portfolio:
        return "Hodl 50/50";
    }
  }

  get options() {
    return Object.values(YieldType).map(x => ({
      label: this.getTokenType(x),
      value: x,
      active: this.type == x
    }));
  }

  get selectedMode() {
    return this.getTokenType(this.type);
  }

  get relay() {
    return findOrThrow(vxm.bancor.relays, (relay: any) =>
      compareString(relay.id, this.focusedId)
    );
  }

  get token() {
    return this.sortedReserves[1];
  }

  get network() {
    return this.sortedReserves[0];
  }

  get sortedReserves() {
    return sortByNetworkTokens(this.reserves, (reserve: any) => reserve.symbol);
  }

  get reserves() {
    return this.relay.reserves;
  }

  get focusedId() {
    return this.$router.currentRoute.params.account;
  }

  get classes() {
    return [
      "block-content",
      "px-0",
      "px-md-3",
      "main",
      ...(this.loading ? ["d-flex", "justify-content-center"] : [])
    ];
  }

  goBack() {
    this.$router.push({
      name: "Relay",
      params: { account: this.focusedId }
    });
  }

  setChartData(data: HistoryRow[]) {
    const selectedData = data.sort((a, b) => a.timestamp - b.timestamp);

    const name = this.token.symbol;

    let cumulative_dm_roi: any[] = [];
    let loss: any[] = [];
    let net_position: any[] = [];
    let price_ratio;
    let cur_loss: number = 0;
    let cur_price = 0;

    let dm_roi = 1;
    let initial_price = 0;

    selectedData.forEach((data, index, arr) => {
      let { timestamp, roi, tradeVolume, tokenPrice } = data;
      cur_price = tokenPrice;

      if (initial_price == 0) {
        initial_price = tokenPrice;
      }

      dm_roi *= roi;
      price_ratio = tokenPrice / initial_price;
      cur_loss = (2.0 * Math.sqrt(price_ratio)) / (1.0 + price_ratio);

      cumulative_dm_roi.push([
        timestamp,
        parseFloat(((dm_roi - 1) * 100).toFixed(2))
      ]);

      loss.push([timestamp, parseFloat(((cur_loss - 1) * 100).toFixed(2))]);

      net_position.push([
        timestamp,
        parseFloat(((cur_loss * dm_roi - 1) * 100).toFixed(2))
      ]);
    });

    this.performance = {
      Token: ((1 + cur_price / initial_price) * cur_loss * dm_roi) / 2,
      Network: ((1 + initial_price / cur_price) * cur_loss * dm_roi) / 2,
      Both: cur_loss * dm_roi
    };

    const colours = Highcharts.getOptions().colors!;

    const series = [
      {
        name: "Collected Fees",
        color: colours[5],
        tooltip: {
          valueSuffix: "%"
        },
        yAxis: 0,
        zIndex: 1,
        data: cumulative_dm_roi
      },
      {
        name: "Impermanent Loss",
        color: colours[0],
        yAxis: 0,
        zIndex: 1,
        data: loss,
        tooltip: {
          valueSuffix: "%"
        }
      },
      {
        name: "Net Profit",
        color: colours[6],
        yAxis: 0,
        zIndex: 1,
        tooltip: {
          valueSuffix: "%"
        },
        data: net_position
      },
      {
        name: "Trade Volume",
        yAxis: 1,
        zIndex: 0,
        data: selectedData.map(x => [x.timestamp, x.tradeVolume]),
        tooltip: {
          valueSuffix: " " + name
        },
        type: "column",
        color: "#bbb"
      }
    ];

    const chartData = {
      rangeSelector: {
        selected: 5,
        buttons: [
          {
            type: "week",
            count: 1,
            text: "1w"
          },
          {
            type: "month",
            count: 1,
            text: "1m"
          },
          {
            type: "month",
            count: 3,
            text: "3m"
          },
          {
            type: "month",
            count: 6,
            text: "6m"
          },
          {
            type: "year",
            count: 1,
            text: "1y"
          },
          {
            type: "all",
            text: "All"
          }
        ],
        inputEnabled: true
      },
      title: {
        text: this.relay.reserves.map(r => r.symbol).join("-")
      },
      subtitle: {
        text: "ROI"
      },
      credits: {
        enabled: false
      },
      legend: {
        enabled: true,
        align: "center"
      },
      xAxis: {
        events: {
          afterSetExtremes: (event: AxisSetExtremesEventObject) => {
            this.setRange(event.min, event.max);
          }
        }
      },
      yAxis: [
        {
          visible: false,
          title: {
            text: "ROI"
          }
        },
        {
          visible: false,
          title: {
            text: "Token Price"
          }
        },
        {
          visible: false,
          title: {
            text: "Trade Volume"
          }
        }
      ],
      series
    };

    this.chartOptions = chartData;
    this.loading = false;
  }

  async fetchData() {
    this.loading = true;
    const data = await vxm.bancor.fetchHistoryData(this.relay.id);
    this.data = data;
    this.setChartData(data);
  }

  created() {
    this.fetchData();
  }
}
</script>

<style lang="scss">
.base {
  padding: 10px;
  background-color: white;
}
</style>
