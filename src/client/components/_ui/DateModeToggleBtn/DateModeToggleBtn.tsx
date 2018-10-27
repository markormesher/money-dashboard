import { faCalendar } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { IRootState } from "../../../redux/root";
import { DateModeOption } from "../../../redux/transactions/reducer";
import { IconBtn } from "../IconBtn/IconBtn";

interface IDateModeToggleBtnProps {
	stateFilter: (state: IRootState) => DateModeOption;
	stateModifier: (value: DateModeOption) => void;
	value?: DateModeOption;
	onChange?: (value: DateModeOption) => void;
	btnProps?: React.HTMLProps<HTMLButtonElement>;
}

function mapStateToProps(state: IRootState, props: IDateModeToggleBtnProps): IDateModeToggleBtnProps {
	return {
		...props,
		value: props.stateFilter(state),
	};
}

class UCDateModeToggleBtn extends Component<IDateModeToggleBtnProps> {

	constructor(props: IDateModeToggleBtnProps) {
		super(props);

		this.toggleValue = this.toggleValue.bind(this);
	}

	public render() {
		const { value, btnProps } = this.props;
		const text = `Date Mode: ${this.capitaliseFirst(value)} Date`;

		return (
				<IconBtn
						icon={faCalendar}
						text={text}
						btnProps={{
							...btnProps,
							onClick: this.toggleValue,
						}}
				/>
		);
	}

	private capitaliseFirst = (str: string) => str.slice(0, 1).toUpperCase() + str.slice(1);

	private toggleValue() {
		const { value, stateModifier, onChange } = this.props;
		const newValue = value === "effective" ? "transaction" : "effective";
		stateModifier(newValue);
		if (onChange) {
			onChange(newValue);
		}
	}

}

export const DateModeToggleBtn = connect(mapStateToProps)(UCDateModeToggleBtn);
