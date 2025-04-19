import { isSameDay, subMonths, subYears } from "date-fns";
import { PLATFORM_MINIMUM_DATE } from "../../config/consts.js";
import { FormValidationResult } from "../components/common/form/hook.js";
import { formatDate } from "./dates.js";

type DateRange = {
  startDate: Date;
  endDate: Date;
};

const today = new Date();

const dateRangePresets = [
  [
    "Last Month",
    {
      startDate: subMonths(today, 1),
      endDate: today,
    },
  ],
  [
    "Last Year",
    {
      startDate: subYears(today, 1),
      endDate: today,
    },
  ],
  [
    "All Time",
    {
      startDate: PLATFORM_MINIMUM_DATE,
      endDate: new Date("2099-12-31"),
    },
  ],
] as const;

function validateDateRange(value: Partial<DateRange>): FormValidationResult<DateRange> {
  const result: FormValidationResult<DateRange> = { isValid: true, errors: {} };

  if (value?.startDate === undefined) {
    result.isValid = false;
  } else {
    if (isNaN(value.startDate.getTime())) {
      result.isValid = false;
      result.errors.startDate = "Invalid date";
    } else if (value.startDate.getTime() < PLATFORM_MINIMUM_DATE.getTime()) {
      result.isValid = false;
      result.errors.startDate = "Date must not be before the platform minimum";
    }
  }

  if (value?.endDate === undefined) {
    result.isValid = false;
  } else {
    if (isNaN(value.endDate.getTime())) {
      result.isValid = false;
      result.errors.endDate = "Invalid date";
    } else if (value.endDate.getTime() < PLATFORM_MINIMUM_DATE.getTime()) {
      result.isValid = false;
      result.errors.endDate = "Date must not be before the platform minimum";
    }
  }

  if (!result.errors.startDate && !result.errors.endDate) {
    if ((value.endDate?.getTime() ?? 0) < (value.startDate?.getTime() ?? 0)) {
      result.isValid = false;
      result.errors.endDate = "End date must after the start date";
    }
  }

  return result;
}

function describeDateRange(dr: DateRange): string {
  for (const p of dateRangePresets) {
    if (isSameDay(dr.startDate, p[1].startDate) && isSameDay(dr.endDate, p[1].endDate)) {
      return p[0];
    }
  }

  return formatDate(dr.startDate) + " to " + formatDate(dr.endDate);
}

export { type DateRange, dateRangePresets, validateDateRange, describeDateRange };
