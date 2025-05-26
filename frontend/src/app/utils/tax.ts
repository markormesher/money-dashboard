import { parseDateFromProto } from "./dates.js";

const taxYearStartMonth = 3; // april
const taxYearStartDate = 6;

function getTaxYear(date: bigint): number {
  const d = parseDateFromProto(date);
  if (d.getMonth() >= taxYearStartMonth || (d.getMonth() == taxYearStartMonth && d.getDate() >= taxYearStartDate)) {
    return d.getFullYear();
  } else {
    return d.getFullYear() - 1;
  }
}

export { getTaxYear };
