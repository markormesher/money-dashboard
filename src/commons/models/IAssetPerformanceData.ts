interface IAssetPerformanceData {
  readonly dataExclGrowth: Array<{ x: number; y: number }>;
  readonly dataInclGrowth: Array<{ x: number; y: number }>;
  readonly totalChangeInclGrowth: number;
  readonly totalChangeExclGrowth: number;
  readonly zeroBasis: boolean;
  readonly showAsPercent: boolean;
}

export { IAssetPerformanceData };
