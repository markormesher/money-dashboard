interface IBalanceHistoryData {
  readonly balanceDataPoints: Array<{ x: number; y: number }>;
  readonly minTotal: number;
  readonly maxTotal: number;
  readonly minDate: number;
  readonly maxDate: number;
  readonly changeAbsolute: number;
}

export { IBalanceHistoryData };
