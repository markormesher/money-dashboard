import { Asset } from "../../api_gen/moneydashboard/v4/assets_pb.js";

function formatAsset(amount: number, asset: Asset): string {
  return amount.toFixed(asset.displayPrecision);
}

export { formatAsset };
