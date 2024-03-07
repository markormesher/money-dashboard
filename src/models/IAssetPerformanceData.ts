type IAssetPerformanceData = {
  readonly dataExclGrowth: { x: number; y: number }[];
  readonly dataInclGrowth: { x: number; y: number }[];
  readonly totalChangeInclGrowth: number;
  readonly totalChangeExclGrowth: number;
  readonly zeroBasis: boolean;
  readonly showAsPercent: boolean;
};

export { IAssetPerformanceData };
