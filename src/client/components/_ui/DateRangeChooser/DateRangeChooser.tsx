import { faCalendar } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Moment from "moment";
import * as React from "react";
import { Component, CSSProperties, MouseEvent, ReactNode, RefObject } from "react";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { formatDate } from "../../../helpers/formatters";
import { combine } from "../../../helpers/style-helpers";
import * as styles from "./DateRangeChooser.scss";

interface IDateRangeChooserProps {
	readonly startDate: Moment.Moment;
	readonly endDate: Moment.Moment;
	readonly onValueChange?: (start: Moment.Moment, end: Moment.Moment) => void;
	readonly btnProps?: React.HTMLProps<HTMLButtonElement>;
}

interface IDateRangeChooserState {
	readonly chooserOpen: boolean;
}

class DateRangeChooser extends Component<IDateRangeChooserProps, IDateRangeChooserState> {

	private readonly btnRef: RefObject<HTMLButtonElement>;

	constructor(props: IDateRangeChooserProps) {
		super(props);
		this.state = {
			chooserOpen: false,
		};

		this.btnRef = React.createRef();

		this.renderChooser = this.renderChooser.bind(this);
		this.renderPresetBtn = this.renderPresetBtn.bind(this);
		this.handlePresetClick = this.handlePresetClick.bind(this);
		this.toggleChooser = this.toggleChooser.bind(this);
		this.getChooserPosition = this.getChooserPosition.bind(this);
	}

	public render(): ReactNode {
		const { startDate, endDate, btnProps } = this.props;
		const { chooserOpen } = this.state;

		return (
				<>
					<button
							className={combine(bs.btn, bs.btnOutlineDark)}
							ref={this.btnRef}
							onClick={this.toggleChooser}
							{...btnProps}
					>
						<FontAwesomeIcon icon={faCalendar} className={bs.mr2}/>
						{formatDate(startDate)} to {formatDate(endDate)}
					</button>
					{chooserOpen && this.renderChooser()}
				</>
		);
	}

	private renderChooser(): ReactNode {
		return (
				<div
						className={styles.chooser}
						style={this.getChooserPosition()}
				>
					<div className={bs.btnGroupVertical}>
						{this.renderPresetBtn("This Month", Moment().startOf("month"), Moment().endOf("month"))}
						{this.renderPresetBtn("This Year", Moment().startOf("year"), Moment().endOf("year"))}
						{this.renderPresetBtn("Year to Date", Moment().subtract(1, "year"), Moment())}
						{this.renderPresetBtn("All Time", Moment(new Date(1970, 0, 1)), Moment())}
						{/* TODO: custom ranges */}
						{/*<button className={combine(bs.btn, bs.btnOutlineDark)}>*/}
						{/*Custom*/}
						{/*</button>*/}
						<button className={combine(bs.btn, bs.btnOutlineDark)} onClick={this.toggleChooser}>
							Cancel
						</button>
					</div>
				</div>
		);
	}

	private renderPresetBtn(label: string, start: Moment.Moment, end: Moment.Moment): ReactNode {
		return (
				<button
						data-start={start.toISOString()}
						data-end={end.toISOString()}
						onClick={this.handlePresetClick}
						className={combine(bs.btn, bs.btnOutlineDark)}
				>
					{label}
				</button>
		);
	}

	private handlePresetClick(evt: MouseEvent<HTMLButtonElement>): void {
		const start = evt.currentTarget.attributes.getNamedItem("data-start").value;
		const end = evt.currentTarget.attributes.getNamedItem("data-end").value;
		if (start && end) {
			if (this.props.onValueChange) {
				this.props.onValueChange(Moment(start), Moment(end));
			}
			this.toggleChooser();
		}
	}

	private toggleChooser(): void {
		this.setState({
			chooserOpen: !this.state.chooserOpen,
		});
	}

	private getChooserPosition(): CSSProperties {
		if (!this.btnRef.current) {
			return null;
		}

		const bounds = this.btnRef.current.getBoundingClientRect();
		return {
			top: `${bounds.bottom + 10}px`,
			right: `${window.innerWidth - bounds.right}px`,
		};
	}
}

export {
	DateRangeChooser,
};
