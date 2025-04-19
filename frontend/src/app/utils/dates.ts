const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(date?: Date, format: "human" | "system" = "human"): string {
  if (date === undefined) {
    return "";
  }

  let out: string;
  if (format == "human") {
    out = `${date.getDate() < 10 ? "0" : ""}${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  } else {
    out = date.toISOString().substring(0, 10);
  }

  return out;
}

function formatDateFromProto(raw?: bigint, format: "human" | "system" = "human"): string {
  if (raw === undefined) {
    return "";
  }

  const date = parseDateFromProto(raw);
  if (isNaN(date.getTime())) {
    console.log("Cannot format invalid data from proto", raw);
    return "invalid";
  }

  return formatDate(date, format);
}

function parseDateFromProto(raw: bigint): Date {
  // dates are passed to the API as second-precision timestamps, which are stored as bigint values
  return new Date(Number(raw) * 1000);
}

function convertDateToProto(raw: Date): bigint {
  if (isNaN(raw.getTime())) {
    return BigInt("0");
  } else {
    return BigInt(Math.floor(raw.getTime() / 1000).toString());
  }
}

function convertDateStrToProto(raw: string): bigint | undefined {
  if (!raw || raw.trim() == "") {
    return undefined;
  } else {
    return convertDateToProto(new Date(raw));
  }
}

export { formatDate, formatDateFromProto, parseDateFromProto, convertDateToProto, convertDateStrToProto };
