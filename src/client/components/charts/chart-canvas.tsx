import * as React from "react";
import { Chart, ChartConfiguration } from "chart.js/auto";
import { formatCurrency, formatDate } from "../../helpers/formatters";
import { mergeDeep } from "../../../utils/helpers";

type ChartCanvasProps = {
  readonly initConfig?: Partial<ChartConfiguration>;
  readonly chartRef: React.MutableRefObject<Chart | null>;
};

const defaultConfig: ChartConfiguration = {
  type: "line",
  data: { datasets: [] },
  options: {
    responsive: true,
    animation: false,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        type: "linear",
        bounds: "data",
        grace: 0,
        ticks: {
          callback: (v) => formatDate(parseInt("" + v)),
        },
      },
      y: {
        min: 0,
        ticks: {
          callback: (v) => formatCurrency(parseFloat("" + v)),
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (ctx) => {
            return formatDate(ctx[0].parsed.x);
          },
          label: (ctx) => {
            return " " + formatCurrency(ctx.parsed.y);
          },
        },
      },
    },
  },
};

function ChartCanvas(props: ChartCanvasProps): React.ReactElement {
  const { initConfig, chartRef } = props;
  const chartCanvas = React.useRef<HTMLCanvasElement>(null);

  const config = mergeDeep(defaultConfig, initConfig);

  React.useEffect(() => {
    chartRef.current?.destroy();

    if (chartCanvas.current) {
      chartRef.current = new Chart(chartCanvas.current, config);
    }

    return function cleanup() {
      chartRef.current?.destroy();
    };
  }, []);

  return <canvas ref={chartCanvas} />;
}

export { ChartCanvas };
