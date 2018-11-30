import { ChartDataSets } from "chart.js";

interface IAssetPerformanceData {
	readonly datasets: ChartDataSets[];
	readonly totalChangeInclGrowth: number;
	readonly totalChangeExclGrowth: number;
}

export {
	IAssetPerformanceData,
};
