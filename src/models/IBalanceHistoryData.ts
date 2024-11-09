type IBalanceHistoryData = {
  readonly balanceDataPoints: { x: number; y: number }[];
  readonly minTotal: number;
  readonly maxTotal: number;
  readonly minTotalDate: number;
  readonly maxTotalDate: number;
  readonly changeAbsolute: number;
};

export { IBalanceHistoryData };
