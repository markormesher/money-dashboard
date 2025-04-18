import { Asset } from "../../api_gen/moneydashboard/v4/assets_pb.js";

function formatAssetValue(amount: number, asset: Asset): string {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: asset.displayPrecision,
    maximumFractionDigits: asset.displayPrecision,
  });
}

function formatAssetQuantity(amount: number): string {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: Math.max(2, Math.min(10, getPrecision(amount))),
    maximumFractionDigits: 10,
  });
}

function getPrecision(v: number): number {
  if (isNaN(v) || !isFinite(v)) {
    return 0;
  }
  let e = 1;
  let p = 0;
  while (Math.round(v * e) / e !== v) {
    e *= 10;
    p++;
  }
  return p;
}

export { formatAssetValue, formatAssetQuantity };
