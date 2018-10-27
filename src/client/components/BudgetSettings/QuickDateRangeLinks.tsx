import * as moment from "moment";
import { Moment } from "moment";
import * as React from "react";
import { MouseEvent, PureComponent } from "react";

enum QuickDates {
	THIS_MONTH, THIS_YEAR,
	NEXT_MONTH, NEXT_YEAR,
}

interface IQuickDateRangeLinks {
	readonly handleSelection: (start: Moment, end: Moment) => void;
}

class QuickDateRangeLinks extends PureComponent<IQuickDateRangeLinks> {

	constructor(props: IQuickDateRangeLinks) {
		super(props);

		this.setQuickDateThisMonth = this.setQuickDateThisMonth.bind(this);
		this.setQuickDateThisYear = this.setQuickDateThisYear.bind(this);
		this.setQuickDateNextMonth = this.setQuickDateNextMonth.bind(this);
		this.setQuickDateNextYear = this.setQuickDateNextYear.bind(this);
		this.setQuickDate = this.setQuickDate.bind(this);
	}

	public render() {
		return (
				<>
					<a href={"#"} onClick={this.setQuickDateThisMonth}>This month</a>
					<> &bull; </>
					<a href={"#"} onClick={this.setQuickDateThisYear}>This year</a>
					<> &bull; </>
					<a href={"#"} onClick={this.setQuickDateNextMonth}>Next month</a>
					<> &bull; </>
					<a href={"#"} onClick={this.setQuickDateNextYear}>Next year</a>
				</>
		);
	}

	private setQuickDateThisMonth(e: MouseEvent) {
		this.setQuickDate(QuickDates.THIS_MONTH, e);
	}

	private setQuickDateThisYear(e: MouseEvent) {
		this.setQuickDate(QuickDates.THIS_YEAR, e);
	}

	private setQuickDateNextMonth(e: MouseEvent) {
		this.setQuickDate(QuickDates.NEXT_MONTH, e);
	}

	private setQuickDateNextYear(e: MouseEvent) {
		this.setQuickDate(QuickDates.NEXT_YEAR, e);
	}

	private setQuickDate(which: QuickDates, evt?: MouseEvent) {
		if (evt) {
			evt.preventDefault();
		}

		const start = moment();
		const end = moment();

		switch (which) {
			case QuickDates.THIS_MONTH:
				start.startOf("month");
				end.endOf("month");
				break;

			case QuickDates.THIS_YEAR:
				start.startOf("year");
				end.endOf("year");
				break;

			case QuickDates.NEXT_MONTH:
				start.add(1, "month").startOf("month");
				end.add(1, "month").endOf("month");
				break;

			case QuickDates.NEXT_YEAR:
				start.add(1, "year").startOf("year");
				end.add(1, "year").endOf("year");
				break;
		}

		this.props.handleSelection(start, end);
	}
}

export {
	QuickDateRangeLinks,
};
