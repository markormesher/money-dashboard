import { faCalendar } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { capitaliseFirstLetter } from "../../../helpers/formatters";
import { IRootState } from "../../../redux/root";
import { DateModeOption } from "../../../redux/transactions/reducer";
import { IconBtn } from "../IconBtn/IconBtn";

interface IDateModeToggleBtnProps {
	readonly stateFilter: (state: IRootState) => DateModeOption;
	readonly stateModifier: (value: DateModeOption) => void;
	readonly value?: DateModeOption;
	readonly onChange?: (value: DateModeOption) => void;
	readonly btnProps?: React.HTMLProps<HTMLButtonElement>;
}

function mapStateToProps(state: IRootState, props: IDateModeToggleBtnProps): IDateModeToggleBtnProps {
	return {
		...props,
		value: props.stateFilter(state),
	};
}

class UCDateModeToggleBtn extends PureComponent<IDateModeToggleBtnProps> {

	constructor(props: IDateModeToggleBtnProps) {
		super(props);

		this.toggleValue = this.toggleValue.bind(this);
	}

	public render() {
		const { value, btnProps } = this.props;
		const text = `Date Mode: ${capitaliseFirstLetter(value)} Date`;

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
