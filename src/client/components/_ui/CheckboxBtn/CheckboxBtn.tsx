import { faCheckSquare, faSquare } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { IRootState } from "../../../redux/root";
import { IconBtn } from "../IconBtn/IconBtn";

interface ICheckboxBtnProps {
	text: string;
	stateFilter: (state: IRootState) => boolean;
	stateModifier: (checked: boolean) => void;
	checked?: boolean;
	onChange?: (checked: boolean) => void;
	btnProps?: React.HTMLProps<HTMLButtonElement>;
}

function mapStateToProps(state: IRootState, props: ICheckboxBtnProps): ICheckboxBtnProps {
	return {
		...props,
		checked: props.stateFilter(state),
	};
}

class UCCheckboxBtn extends Component<ICheckboxBtnProps> {

	constructor(props: ICheckboxBtnProps) {
		super(props);

		this.toggleChecked = this.toggleChecked.bind(this);
	}

	public render() {
		const { text, checked, btnProps } = this.props;
		const icon = checked ? faCheckSquare : faSquare;

		return (
				<IconBtn
						icon={icon}
						text={text}
						btnProps={{
							...btnProps,
							onClick: this.toggleChecked,
						}}
				/>
		);
	}

	private toggleChecked() {
		const { checked, stateModifier } = this.props;
		const newState = !checked;
		stateModifier(newState);
	}

}

export const CheckboxBtn = connect(mapStateToProps)(UCCheckboxBtn);
