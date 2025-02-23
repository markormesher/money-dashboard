import { Asset } from "../../api_gen/moneydashboard/v4/assets_pb.js";

function formatAsset(amount: number, asset: Asset): string {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: asset.displayPrecision,
    maximumFractionDigits: asset.displayPrecision,
  });
}

export { formatAsset };
