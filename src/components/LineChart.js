import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import { toNumberSafe } from "../utils/numerics";

export default class LineChart extends Component {
  state = {
    data: {},
    options: {},
    newdata: {},
  };

  componentDidMount = () => {
    setTimeout(() => {
      // Defensive programming: Ensure overallEndorsement is a valid array of numbers
      const rawData = this.props.overallEndorsement;
      const safeData = Array.isArray(rawData)
        ? rawData.map(item => toNumberSafe(item))
        : [];

      var data = {
        labels: safeData.map((_, index) => index),
        datasets: [
          {
            label: "Endorse Rating Spread",
            data: safeData,
            fill: false,
            backgroundColor: "white",
            borderColor: "rgba(255,255,255,0.3)",
          },
        ],
      };

      var options = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      };
      this.setState({
        data,
        options,
      });
    }, 1000);
  };
  render() {
    return <Line data={this.state.data} options={this.state.options} />;
  }
}