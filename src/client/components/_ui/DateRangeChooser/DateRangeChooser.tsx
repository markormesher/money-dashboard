import { faCalendar, faCheck } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { Component, CSSProperties, MouseEvent, ReactNode, RefObject } from "react";
import { startOfMonth, endOfMonth, addMonths, startOfYear, endOfYear, addYears, subYears, isSameDay } from "date-fns";
import { IDateRange } from "../../../../commons/models/IDateRange";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { formatDate } from "../../../helpers/formatters";
import { combine } from "../../../helpers/style-helpers";
import { ControlledDateInput } from "../ControlledInputs/ControlledDateInput";
import { IconBtn } from "../IconBtn/IconBtn";
import * as styles from "./DateRangeChooser.scss";

interface IDateRangeChooserProps {
  readonly startDate?: number;
  readonly endDate?: number;
  readonly includeFuturePresets?: boolean;
  readonly includeCurrentPresets?: boolean;
  readonly includeYearToDatePreset?: boolean;
  readonly includeAllTimePreset?: boolean;
  readonly customPresets?: IDateRange[];
  readonly onValueChange?: (start: number, end: number) => void;
  readonly btnProps?: React.HTMLProps<HTMLButtonElement>;
  readonly setPosition?: boolean;
}

interface IDateRangeChooserState {
  readonly chooserOpen: boolean;
  readonly customRangeChooserOpen: boolean;
  readonly customRangeStart: number;
  readonly customRangeEnd: number;
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

  private readonly btnRef: RefObject<HTMLButtonElement>;

  constructor(props: IDateRangeChooserProps) {
    super(props);
    this.state = {
      chooserOpen: false,
      customRangeChooserOpen: false,
      customRangeStart: undefined,
      customRangeEnd: undefined,
      usingCustomRange: false,
    };

    this.btnRef = React.createRef();

    this.renderChooser = this.renderChooser.bind(this);
    this.renderPresetBtn = this.renderPresetBtn.bind(this);
    this.handlePresetSubmit = this.handlePresetSubmit.bind(this);
    this.handleCustomRangeStartChange = this.handleCustomRangeStartChange.bind(this);
    this.handleCustomRangeEndChange = this.handleCustomRangeEndChange.bind(this);
    this.handleCustomRangeSubmit = this.handleCustomRangeSubmit.bind(this);
    this.toggleChooser = this.toggleChooser.bind(this);
    this.closeChooser = this.closeChooser.bind(this);
    this.toggleCustomRangeChooserOpen = this.toggleCustomRangeChooserOpen.bind(this);
    this.customRangeIsValid = this.customRangeIsValid.bind(this);
    this.getChooserPosition = this.getChooserPosition.bind(this);
  }

  public render(): ReactNode {
    const dateRanges = DateRangeChooser.getDateRanges(this.props);
    const { startDate, endDate, btnProps } = this.props;
    const { chooserOpen } = this.state;

    const matchingRanges = dateRanges.filter((dr) => {
      return isSameDay(dr.startDate, startDate) && isSameDay(dr.endDate, endDate);
    });
    const label = matchingRanges.length
      ? matchingRanges[0].label
      : `${formatDate(startDate)} to ${formatDate(endDate)}`;

    return (
      <>
        <IconBtn
          icon={faCalendar}
          text={label}
          btnProps={{
            ...btnProps,
            ref: this.btnRef,
            onClick: this.toggleChooser,
          }}
        />
        {chooserOpen && this.renderChooser()}
      </>
    );
  }

  private renderChooser(): ReactNode {
    const { setPosition } = this.props;
    const dateRanges = DateRangeChooser.getDateRanges(this.props);

    return (
      <div className={styles.chooser} style={setPosition && this.getChooserPosition()}>
        <div className={bs.row}>
          {this.state.customRangeChooserOpen && (
            <div className={bs.col}>
              <div className={bs.formGroup}>
                <ControlledDateInput
                  id={"custom-from"}
                  label={"From"}
                  value={formatDate(this.state.customRangeStart, "system") || ""}
                  disabled={false}
                  onValueChange={this.handleCustomRangeStartChange}
                />
              </div>
              <div className={bs.formGroup}>
                <ControlledDateInput
                  id={"custom-to"}
                  label={"To"}
                  value={formatDate(this.state.customRangeEnd, "system") || ""}
                  disabled={false}
                  onValueChange={this.handleCustomRangeEndChange}
                />
              </div>
              <div className={bs.formGroup}>
                <IconBtn
                  icon={faCheck}
                  text={"OK"}
                  onClick={this.handleCustomRangeSubmit}
                  btnProps={{
                    className: bs.btnOutlineDark,
                    disabled: !this.customRangeIsValid(),
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

  private toggleChooser(): void {
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
    this.setState({ customRangeStart: value });
  }

  private handleCustomRangeEndChange(value: number): void {
    this.setState({ customRangeEnd: value });
  }

  private handleCustomRangeSubmit(): void {
    /* istanbul ignore else: cannot be triggered if invalid */
    if (this.customRangeIsValid()) {
      this.setState({
        usingCustomRange: true,
      });
      if (this.props.onValueChange) {
        const { customRangeStart, customRangeEnd } = this.state;
        this.props.onValueChange(customRangeStart, customRangeEnd);
      }
      this.closeChooser();
    }
  }

  private customRangeIsValid(): boolean {
    const { customRangeStart, customRangeEnd } = this.state;
    if ((!customRangeStart && customRangeStart !== 0) || (!customRangeEnd && customRangeEnd !== 0)) {
      return false;
    }

    return customRangeStart <= customRangeEnd;
  }

  private getChooserPosition(): CSSProperties {
    /* istanbul ignore if: cannot be simulated with JSDOM/Enzyme */
    if (!this.btnRef.current) {
      return null;
    }

    const bounds = this.btnRef.current.getBoundingClientRect();
    return {
      top: `${bounds.bottom}px`,
      right: `${window.innerWidth - bounds.right}px`,
    };
  }
}

export { DateRangeChooser };
