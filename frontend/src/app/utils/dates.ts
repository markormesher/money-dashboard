const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDateFromProto(raw: bigint, format: "human" | "system" = "human"): string {
  // dates are passed to the API as second-precision timestamps, which are stored as bigint values
  const date = new Date(Number(raw) * 1000);

  let out: string;
  if (format == "human") {
    out = `${date.getDate() < 10 ? "0" : ""}${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  } else {
    out = date.toISOString().substring(0, 10);
  }

  return out;
}

export { formatDateFromProto };
