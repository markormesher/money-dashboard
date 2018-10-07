import { faCheckSquare, faSquare } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { Component } from "react";
import IconBtn from "../IconBtn/IconBtn";

interface ICheckboxBtnProps {
	text: string;
	initiallyChecked?: boolean;
	onChange?: (checked: boolean) => void;
	btnProps?: React.HTMLProps<HTMLButtonElement>;
}

interface ICheckboxBtnState {
	checked: boolean;
}

class CheckboxBtn extends Component<ICheckboxBtnProps, ICheckboxBtnState> {

	constructor(props: ICheckboxBtnProps) {
		super(props);
		this.state = {
			checked: props.initiallyChecked || true,
		};

		this.toggleChecked = this.toggleChecked.bind(this);
	}

	public render() {
		const { text, btnProps } = this.props;
		const { checked } = this.state;
		const icon = checked ? faCheckSquare : faSquare;

		return (
				<IconBtn
						icon={icon}
						text={text}
						btnProps={{
							...btnProps,
							onClick: this.toggleChecked,
						}}/>
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
