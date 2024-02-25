import * as React from "react";
import { startOfMonth, endOfMonth, addMonths, startOfYear, endOfYear, addYears, subYears, isSameDay } from "date-fns";
import { IDateRange } from "../../../../models/IDateRange";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { formatDate } from "../../../helpers/formatters";
import { combine } from "../../../helpers/style-helpers";
import { ControlledDateInput } from "../ControlledInputs/ControlledDateInput";
import { IconBtn } from "../IconBtn/IconBtn";
import { ButtonDropDown, ButtonDropDownProps } from "../ButtonDropDown/ButtonDropDown";
import { validateDateRange } from "../../../../models/validators/DateRangeValidator";

type DateRangeChooserProps = {
  readonly startDate: number;
  readonly endDate: number;
  readonly includeFuturePresets?: boolean;
  readonly includeCurrentPresets?: boolean;
  readonly includeYearToDatePreset?: boolean;
  readonly includeAllTimePreset?: boolean;
  readonly customPresets?: IDateRange[];
  readonly onValueChange?: (start: number, end: number) => void;
  readonly dropDownProps?: Pick<ButtonDropDownProps, "placement" | "btnProps">;
};

function getDateRanges(props: DateRangeChooserProps): IDateRange[] {
  const { includeCurrentPresets, includeFuturePresets, includeYearToDatePreset, includeAllTimePreset, customPresets } =
    props;
  return (
    [
      includeCurrentPresets !== false && {
        label: "This Month",
        startDate: startOfMonth(new Date()).getTime(),
        endDate: endOfMonth(new Date()).getTime(),
      },
      includeFuturePresets !== false && {
        label: "Next Month",
        startDate: startOfMonth(addMonths(new Date(), 1)).getTime(),
        endDate: endOfMonth(addMonths(new Date(), 1)).getTime(),
      },
      includeCurrentPresets !== false && {
        label: "This Year",
        startDate: startOfYear(new Date()).getTime(),
        endDate: endOfYear(new Date()).getTime(),
      },
      includeFuturePresets !== false && {
        label: "Next Year",
        startDate: startOfYear(addYears(new Date(), 1)).getTime(),
        endDate: endOfYear(addYears(new Date(), 1)).getTime(),
      },
      includeYearToDatePreset !== false && {
        label: "Year to Date",
        startDate: subYears(new Date(), 1).getTime(),
        endDate: new Date().getTime(),
      },
      includeAllTimePreset !== false && {
        label: "All Time",
        startDate: 0,
        endDate: new Date().getTime(),
      },
      ...(customPresets || []),
    ] as Array<boolean | IDateRange>
  ).filter((a) => a !== false) as IDateRange[];
}

function DateRangeChooser(props: DateRangeChooserProps): React.ReactElement {
  const { startDate, endDate, dropDownProps, onValueChange } = props;
  const dateRangeOptions = getDateRanges(props);

  const defaultCustomRange: IDateRange = {
    label: "Custome",
    startDate: startOfMonth(new Date()).getTime(),
    endDate: endOfMonth(new Date()).getTime(),
  };

  const [chooserOpen, setChooserOpen] = React.useState(false);
  const [customRangeChooserOpen, setCustomRangeChooserOpen] = React.useState(false);
  const [customRange, setCustomRange] = React.useState(defaultCustomRange);
  const [customRangeValidationResult, setCustomRangeValidationResult] = React.useState(
    validateDateRange(defaultCustomRange),
  );
  const [usingCustomRange, setUsingCustomRange] = React.useState(false);

  // ui

  function renderChooser(): React.ReactElement {
    return (
      <div className={bs.row}>
        {customRangeChooserOpen && (
          <div className={bs.col}>
            <div className={bs.mb3}>
              <ControlledDateInput
                id={"custom-from"}
                label={"From"}
                value={customRange.startDate ? formatDate(customRange.startDate, "system") : ""}
                error={customRangeValidationResult?.errors.startDate}
                disabled={false}
                onValueChange={(val) => {
                  const newCustomRange = { ...customRange, startDate: val };
                  setCustomRange(newCustomRange);
                  setCustomRangeValidationResult(validateDateRange(newCustomRange));
                }}
              />
            </div>
            <div className={bs.mb3}>
              <ControlledDateInput
                id={"custom-to"}
                label={"To"}
                value={customRange.endDate ? formatDate(customRange.endDate, "system") : ""}
                error={customRangeValidationResult?.errors.endDate}
                disabled={false}
                onValueChange={(val) => {
                  const newCustomRange = { ...customRange, startDate: val };
                  setCustomRange(newCustomRange);
                  setCustomRangeValidationResult(validateDateRange(newCustomRange));
                }}
              />
            </div>
            <div className={bs.mb3}>
              <IconBtn
                icon={"check"}
                text={"OK"}
                onClick={() => {
                  if (customRange.startDate && customRange.endDate && customRangeValidationResult.isValid) {
                    setUsingCustomRange(true);
                    setChooserOpen(false);
                    onValueChange?.(customRange.startDate, customRange.endDate);
                  }
                }}
                btnProps={{
                  className: bs.btnOutlineDark,
                  disabled: !customRangeValidationResult?.isValid,
                }}
              />
            </div>
          </div>
        )}
        <div className={bs.col}>
          <div className={bs.btnGroupVertical}>
            {dateRangeOptions.map((dr) => (
              <button
                key={`range-${dr.label}`}
                type={"button"}
                onClick={() => {
                  setUsingCustomRange(false);
                  setChooserOpen(false);
                  if (dr.startDate && dr.endDate) {
                    onValueChange?.(dr.startDate, dr.endDate);
                  }
                }}
                className={combine(bs.btn, bs.btnOutlineDark)}
              >
                {dr.label}
              </button>
            ))}
            <button
              className={combine(bs.btn, bs.btnOutlineDark)}
              type={"button"}
              onClick={() => setCustomRangeChooserOpen(!customRangeChooserOpen)}
            >
              Custom
            </button>
            <button
              className={combine(bs.btn, bs.btnOutlineDark)}
              type={"button"}
              onClick={() => setChooserOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // show the label of the first range option that matches the actual selection, or the actual dates if none match
  const matchingRanges = dateRangeOptions.filter((dr) => {
    return isSameDay(dr.startDate ?? -1, startDate ?? 0) && isSameDay(dr.endDate ?? -1, endDate ?? 0);
  });
  const label = matchingRanges.length ? matchingRanges[0].label : `${formatDate(startDate)} to ${formatDate(endDate)}`;

  return (
    <ButtonDropDown
      icon={"today"}
      text={label ?? ""}
      onBtnClick={() => {
        setChooserOpen(!chooserOpen);
        setCustomRangeChooserOpen(usingCustomRange);
      }}
      dropDownContents={chooserOpen ? renderChooser() : undefined}
      {...dropDownProps}
    />
  );
}

export { DateRangeChooser };
