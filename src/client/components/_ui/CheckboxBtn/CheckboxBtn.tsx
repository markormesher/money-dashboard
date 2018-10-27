import { faCheckSquare, faSquare } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { IRootState } from "../../../redux/root";
import { IconBtn } from "../IconBtn/IconBtn";

interface ICheckboxBtnProps {
	readonly text: string;
	readonly stateFilter: (state: IRootState) => boolean;
	readonly stateModifier: (checked: boolean) => void;
	readonly checked?: boolean;
	readonly onChange?: (checked: boolean) => void;
	readonly btnProps?: React.HTMLProps<HTMLButtonElement>;
}

function mapStateToProps(state: IRootState, props: ICheckboxBtnProps): ICheckboxBtnProps {
	return {
		...props,
		checked: props.stateFilter(state),
	};
}

class UCCheckboxBtn extends PureComponent<ICheckboxBtnProps> {

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
