import { ChartDataSets } from "chart.js";

interface IBalanceHistoryData {
  readonly datasets: ChartDataSets[];
  readonly minTotal: number;
  readonly maxTotal: number;
  readonly minDate: number;
  readonly maxDate: number;
  readonly changeAbsolute: number;
}

export { IBalanceHistoryData };
