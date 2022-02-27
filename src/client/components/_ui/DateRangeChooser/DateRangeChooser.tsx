import { faCalendar, faCheck } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { Component, MouseEvent, ReactNode } from "react";
import { startOfMonth, endOfMonth, addMonths, startOfYear, endOfYear, addYears, subYears, isSameDay } from "date-fns";
import { IDateRange } from "../../../../models/IDateRange";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { formatDate } from "../../../helpers/formatters";
import { combine } from "../../../helpers/style-helpers";
import { ControlledDateInput } from "../ControlledInputs/ControlledDateInput";
import { IconBtn } from "../IconBtn/IconBtn";
import { ButtonDropDown, IButtonDropDownProps } from "../ButtonDropDown/ButtonDropDown";
import { validateDateRange, IDateRangeValidationResult } from "../../../../models/validators/DateRangeValidator";

interface IDateRangeChooserProps {
  readonly startDate?: number;
  readonly endDate?: number;
  readonly includeFuturePresets?: boolean;
  readonly includeCurrentPresets?: boolean;
  readonly includeYearToDatePreset?: boolean;
  readonly includeAllTimePreset?: boolean;
  readonly customPresets?: IDateRange[];
  readonly onValueChange?: (start: number, end: number) => void;
  readonly dropDownProps?: Pick<IButtonDropDownProps, "placement" | "btnProps">;
}

interface IDateRangeChooserState {
  readonly chooserOpen: boolean;
  readonly customRangeChooserOpen: boolean;
  readonly customRange: IDateRange;
  readonly customRangeValidationResult: IDateRangeValidationResult;
  readonly usingCustomRange: boolean;
}

class DateRangeChooser extends Component<IDateRangeChooserProps, IDateRangeChooserState> {
  private static getDateRanges(props: IDateRangeChooserProps): IDateRange[] {
    const {
      includeCurrentPresets,
      includeFuturePresets,
      includeYearToDatePreset,
      includeAllTimePreset,
      customPresets,
    } = props;
    return ([
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
    ] as Array<boolean | IDateRange>).filter((a) => a !== false) as IDateRange[];
  }

  constructor(props: IDateRangeChooserProps) {
    super(props);
    this.state = {
      chooserOpen: false,
      customRangeChooserOpen: false,
      customRange: { startDate: undefined, endDate: undefined },
      customRangeValidationResult: validateDateRange({ startDate: undefined, endDate: undefined }),
      usingCustomRange: false,
    };

    this.renderChooser = this.renderChooser.bind(this);
    this.renderPresetBtn = this.renderPresetBtn.bind(this);
    this.handlePresetSubmit = this.handlePresetSubmit.bind(this);
    this.handleCustomRangeStartChange = this.handleCustomRangeStartChange.bind(this);
    this.handleCustomRangeEndChange = this.handleCustomRangeEndChange.bind(this);
    this.handleCustomRangeSubmit = this.handleCustomRangeSubmit.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.closeChooser = this.closeChooser.bind(this);
    this.toggleCustomRangeChooserOpen = this.toggleCustomRangeChooserOpen.bind(this);
  }

  public render(): ReactNode {
    const dateRanges = DateRangeChooser.getDateRanges(this.props);
    const { startDate, endDate, dropDownProps } = this.props;
    const { chooserOpen } = this.state;

    const matchingRanges = dateRanges.filter((dr) => {
      return isSameDay(dr.startDate, startDate) && isSameDay(dr.endDate, endDate);
    });
    const label = matchingRanges.length
      ? matchingRanges[0].label
      : `${formatDate(startDate)} to ${formatDate(endDate)}`;

    return (
      <ButtonDropDown
        icon={faCalendar}
        text={label}
        onBtnClick={this.handleBtnClick}
        dropDownContents={chooserOpen ? this.renderChooser() : null}
        {...dropDownProps}
      />
    );
  }

  private renderChooser(): ReactNode {
    const dateRanges = DateRangeChooser.getDateRanges(this.props);

    return (
      <div className={bs.row}>
        {this.state.customRangeChooserOpen && (
          <div className={bs.col}>
            <div className={bs.mb3}>
              <ControlledDateInput
                id={"custom-from"}
                label={"From"}
                value={formatDate(this.state.customRange.startDate, "system") || ""}
                error={this.state.customRangeValidationResult.errors.startDate}
                disabled={false}
                onValueChange={this.handleCustomRangeStartChange}
              />
            </div>
            <div className={bs.mb3}>
              <ControlledDateInput
                id={"custom-to"}
                label={"To"}
                value={formatDate(this.state.customRange.endDate, "system") || ""}
                error={this.state.customRangeValidationResult.errors.endDate}
                disabled={false}
                onValueChange={this.handleCustomRangeEndChange}
              />
            </div>
            <div className={bs.mb3}>
              <IconBtn
                icon={faCheck}
                text={"OK"}
                onClick={this.handleCustomRangeSubmit}
                btnProps={{
                  className: bs.btnOutlineDark,
                  disabled: !this.state.customRangeValidationResult.isValid,
                }}
              />
            </div>
          </div>
        )}
        <div className={bs.col}>
          <div className={bs.btnGroupVertical}>
            {dateRanges.map((dr) => this.renderPresetBtn(dr))}
            <button className={combine(bs.btn, bs.btnOutlineDark)} onClick={this.toggleCustomRangeChooserOpen}>
              Custom
            </button>
            <button className={combine(bs.btn, bs.btnOutlineDark)} onClick={this.closeChooser}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  private renderPresetBtn(dateRange: IDateRange): ReactNode {
    return (
      <button
        key={`range-${dateRange.label}`}
        data-start={dateRange.startDate}
        data-end={dateRange.endDate}
        onClick={this.handlePresetSubmit}
        className={combine(bs.btn, bs.btnOutlineDark)}
      >
        {dateRange.label}
      </button>
    );
  }

  private handleBtnClick(): void {
    this.setState({
      chooserOpen: !this.state.chooserOpen,
      customRangeChooserOpen: this.state.usingCustomRange,
    });
  }

  private closeChooser(): void {
    this.setState({
      chooserOpen: false,
      customRangeChooserOpen: this.state.usingCustomRange,
    });
  }

  private handlePresetSubmit(evt: MouseEvent<HTMLButtonElement>): void {
    const start = parseInt(evt.currentTarget.attributes.getNamedItem("data-start").value);
    const end = parseInt(evt.currentTarget.attributes.getNamedItem("data-end").value);
    this.setState({
      usingCustomRange: false,
    });
    if (this.props.onValueChange) {
      this.props.onValueChange(start, end);
    }
    this.closeChooser();
  }

  private toggleCustomRangeChooserOpen(): void {
    this.setState({
      customRangeChooserOpen: !this.state.customRangeChooserOpen,
    });
  }

  private handleCustomRangeStartChange(value: number): void {
    this.setState((oldState) => {
      const newRange: IDateRange = {
        ...oldState.customRange,
        startDate: value,
      };
      return {
        customRange: newRange,
        customRangeValidationResult: validateDateRange(newRange),
      };
    });
  }

  private handleCustomRangeEndChange(value: number): void {
    this.setState((oldState) => {
      const newRange: IDateRange = {
        ...oldState.customRange,
        endDate: value,
      };
      return {
        customRange: newRange,
        customRangeValidationResult: validateDateRange(newRange),
      };
    });
  }

  private handleCustomRangeSubmit(): void {
    /* istanbul ignore else: cannot be triggered if invalid */
    if (this.state.customRangeValidationResult.isValid) {
      this.setState({
        usingCustomRange: true,
      });
      if (this.props.onValueChange) {
        const { startDate, endDate } = this.state.customRange;
        this.props.onValueChange(startDate, endDate);
      }
      this.closeChooser();
    }
  }
}

export { DateRangeChooser };
