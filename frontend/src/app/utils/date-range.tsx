import { PLATFORM_MAXIMUM_DATE, PLATFORM_MINIMUM_DATE } from "../../config/consts.js";
import { FormValidationResult } from "../components/common/form/hook.js";
import { addMonths, convertDateToProto, formatDateFromProto, isSameDay, parseDateFromProto } from "./dates.js";

type DateRange = {
  startDate: bigint;
  endDate: bigint;
};

const today = convertDateToProto(new Date());

const dateRangePresets = [
  [
    "Last Month",
    {
      startDate: addMonths(today, -1),
      endDate: today,
    },
  ],
  [
    "Last 6 Months",
    {
      startDate: addMonths(today, -6),
      endDate: today,
    },
  ],
  [
    "Last Year",
    {
      startDate: addMonths(today, -12),
      endDate: today,
    },
  ],
  [
    "Last 2 Years",
    {
      startDate: addMonths(today, -24),
      endDate: today,
    },
  ],
  [
    "Last 5 Years",
    {
      startDate: addMonths(today, -60),
      endDate: today,
    },
  ],
  [
    "All Time",
    {
      startDate: convertDateToProto(PLATFORM_MINIMUM_DATE),
      endDate: convertDateToProto(PLATFORM_MAXIMUM_DATE),
    },
  ],
] as const;

function validateDateRange(value: Partial<DateRange>): FormValidationResult<DateRange> {
  const result: FormValidationResult<DateRange> = { isValid: true, errors: {} };

  if (value?.startDate === undefined) {
    result.isValid = false;
  } else {
    const dateParsed = parseDateFromProto(value.startDate);
    if (isNaN(dateParsed.getTime())) {
      result.isValid = false;
      result.errors.startDate = "Invalid date";
    } else if (dateParsed.getTime() < PLATFORM_MINIMUM_DATE.getTime()) {
      result.isValid = false;
      result.errors.startDate = "Date must not be before the platform minimum";
    } else if (dateParsed.getTime() > PLATFORM_MAXIMUM_DATE.getTime()) {
      result.isValid = false;
      result.errors.startDate = "Date must not be after the platform maximum";
    }
  }

  if (value?.endDate === undefined) {
    result.isValid = false;
  } else {
    const dateParsed = parseDateFromProto(value.endDate);
    if (isNaN(dateParsed.getTime())) {
      result.isValid = false;
      result.errors.endDate = "Invalid date";
    } else if (dateParsed.getTime() < PLATFORM_MINIMUM_DATE.getTime()) {
      result.isValid = false;
      result.errors.endDate = "Date must not be before the platform minimum";
    } else if (dateParsed.getTime() > PLATFORM_MAXIMUM_DATE.getTime()) {
      result.isValid = false;
      result.errors.endDate = "Date must not be after the platform maximum";
    }
  }

  if (!result.errors.startDate && !result.errors.endDate) {
    if ((value.endDate ?? 0) < (value.startDate ?? 0)) {
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

  return formatDateFromProto(dr.startDate) + " to " + formatDateFromProto(dr.endDate);
}

export { type DateRange, dateRangePresets, validateDateRange, describeDateRange };
