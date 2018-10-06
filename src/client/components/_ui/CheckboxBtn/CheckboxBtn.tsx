import { faCheckSquare, faSquare } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Component } from "react";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";

interface ICheckboxBtnProps {
	initiallyChecked: boolean;
	btnClassNames?: string;
	onChange?: (checked: boolean) => void;
}

interface ICheckboxBtnState {
	checked: boolean;
}

class CheckboxBtn extends Component<ICheckboxBtnProps, ICheckboxBtnState> {

	constructor(props: ICheckboxBtnProps) {
		super(props);
		this.state = {
			checked: props.initiallyChecked,
		};

		this.toggleChecked = this.toggleChecked.bind(this);
	}

	public render() {
		const { btnClassNames } = this.props;
		const { checked } = this.state;
		const icon = checked ? faCheckSquare : faSquare;

		return (
				<button className={combine(bs.btn, btnClassNames)} onClick={this.toggleChecked}>
					<FontAwesomeIcon fixedWidth={true} icon={icon}/> {this.props.children}
				</button>
		);
	}

	private toggleChecked() {
		const newState = !this.state.checked;
		this.setState({ checked: newState });
		if (this.props.onChange) {
			this.props.onChange(newState);
		}
	}

}

export default CheckboxBtn;
