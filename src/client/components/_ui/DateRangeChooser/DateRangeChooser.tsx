import { faCalendar, faCheck } from "@fortawesome/pro-light-svg-icons";
import * as Moment from "moment";
import * as React from "react";
import { Component, CSSProperties, MouseEvent, ReactNode, RefObject } from "react";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { formatDate } from "../../../helpers/formatters";
import { combine } from "../../../helpers/style-helpers";
import { ControlledDateInput } from "../FormComponents/ControlledDateInput";
import { IconBtn } from "../IconBtn/IconBtn";
import * as styles from "./DateRangeChooser.scss";

interface IDateRangeChooserProps {
	readonly startDate?: Moment.Moment;
	readonly endDate?: Moment.Moment;
	readonly includeFuturePresets?: boolean;
	readonly includeYearToDate?: boolean;
	readonly includeAllTime?: boolean;
	readonly onValueChange?: (start: Moment.Moment, end: Moment.Moment) => void;
	readonly btnProps?: React.HTMLProps<HTMLButtonElement>;
}

interface IDateRangeChooserState {
	readonly chooserOpen: boolean;
	readonly customRangeChooserOpen: boolean;
	readonly customRangeStart: string;
	readonly customRangeEnd: string;
	readonly usingCustomRange: boolean;
}

interface IDateRange {
	readonly label: string;
	readonly startDate: Moment.Moment;
	readonly endDate: Moment.Moment;
}

class DateRangeChooser extends Component<IDateRangeChooserProps, IDateRangeChooserState> {

	private static getDateRanges(props: IDateRangeChooserProps): IDateRange[] {
		const { includeFuturePresets, includeYearToDate, includeAllTime } = props;
		return ([
			{
				label: "This Month",
				startDate: Moment().startOf("month"),
				endDate: Moment().endOf("month"),
			},
			includeFuturePresets !== false && {
				label: "Next Month",
				startDate: Moment().add(1, "month").startOf("month"),
				endDate: Moment().add(1, "month").endOf("month"),
			},
			{
				label: "This Year",
				startDate: Moment().startOf("year"),
				endDate: Moment().endOf("year"),
			},
			includeFuturePresets !== false && {
				label: "Next Year",
				startDate: Moment().add(1, "year").startOf("year"),
				endDate: Moment().add(1, "year").endOf("year"),
			},
			includeYearToDate !== false && {
				label: "Year to Date",
				startDate: Moment().subtract(1, "year"),
				endDate: Moment(),
			},
			includeAllTime !== false && {
				label: "All Time",
				startDate: Moment(new Date(1970, 0, 1)),
				endDate: Moment(),
			},
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
		this.openChooser = this.openChooser.bind(this);
		this.closeChooser = this.closeChooser.bind(this);
		this.toggleChooser = this.toggleChooser.bind(this);
		this.toggleCustomRangeChooserOpen = this.toggleCustomRangeChooserOpen.bind(this);
		this.customRangeIsValid = this.customRangeIsValid.bind(this);
		this.getChooserPosition = this.getChooserPosition.bind(this);
	}

	public render(): ReactNode {
		const dateRanges = DateRangeChooser.getDateRanges(this.props);
		const { startDate, endDate, btnProps } = this.props;
		const { chooserOpen } = this.state;

		const matchingRanges = dateRanges.filter((dr) => {
			return dr.startDate.isSame(startDate, "day") && dr.endDate.isSame(endDate, "day");
		});
		const label = matchingRanges.length ? matchingRanges[0].label : `${formatDate(startDate)} to ${formatDate(endDate)}`;

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
		const dateRanges = DateRangeChooser.getDateRanges(this.props);

		return (
				<div
						className={styles.chooser}
						style={this.getChooserPosition()}
				>
					<div className={bs.row}>
						{
							this.state.customRangeChooserOpen
							&& <div className={bs.col}>
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
						}
						<div className={bs.col}>
							<div className={bs.btnGroupVertical}>
								{dateRanges.map((dr) => this.renderPresetBtn(dr))}
								<button
										className={combine(bs.btn, bs.btnOutlineDark)}
										onClick={this.toggleCustomRangeChooserOpen}
								>
									Custom
								</button>
								<button
										className={combine(bs.btn, bs.btnOutlineDark)}
										onClick={this.closeChooser}
								>
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
						data-start={dateRange.startDate.toISOString()}
						data-end={dateRange.endDate.toISOString()}
						onClick={this.handlePresetSubmit}
						className={combine(bs.btn, bs.btnOutlineDark)}
				>
					{dateRange.label}
				</button>
		);
	}

	private openChooser(): void {
		this.setState({
			chooserOpen: true,
			customRangeChooserOpen: this.state.usingCustomRange,
		});
	}

	private closeChooser(): void {
		this.setState({
			chooserOpen: false,
			customRangeChooserOpen: this.state.usingCustomRange,
		});
	}

	private toggleChooser(): void {
		this.setState({
			chooserOpen: !this.state.chooserOpen,
			customRangeChooserOpen: this.state.usingCustomRange,
		});
	}

	private handlePresetSubmit(evt: MouseEvent<HTMLButtonElement>): void {
		const start = evt.currentTarget.attributes.getNamedItem("data-start").value;
		const end = evt.currentTarget.attributes.getNamedItem("data-end").value;
		if (start && end) {
			this.setState({
				usingCustomRange: false,
			});
			if (this.props.onValueChange) {
				this.props.onValueChange(Moment(start), Moment(end));
			}
			this.closeChooser();
		}
	}

	private toggleCustomRangeChooserOpen(): void {
		this.setState({
			customRangeChooserOpen: !this.state.customRangeChooserOpen,
		});
	}

	private handleCustomRangeStartChange(value: string): void {
		this.setState({ customRangeStart: value });
	}

	private handleCustomRangeEndChange(value: string): void {
		this.setState({ customRangeEnd: value });
	}

	private handleCustomRangeSubmit(): void {
		const { customRangeStart, customRangeEnd } = this.state;
		if (customRangeStart && customRangeEnd) {
			this.setState({
				usingCustomRange: true,
			});
			if (this.props.onValueChange) {
				this.props.onValueChange(Moment(customRangeStart), Moment(customRangeEnd));
			}
			this.closeChooser();
		}
	}

	private customRangeIsValid(): boolean {
		const { customRangeStart, customRangeEnd } = this.state;
		if (!customRangeStart || !customRangeEnd) {
			return false;
		}

		const startAsMoment = Moment(customRangeStart);
		const endAsMoment = Moment(customRangeEnd);

		return startAsMoment.isValid() && endAsMoment.isValid() && startAsMoment.isBefore(endAsMoment);
	}

	private getChooserPosition(): CSSProperties {
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

export {
	DateRangeChooser,
};
