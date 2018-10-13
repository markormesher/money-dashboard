import * as React from "react";
import { Component, FormEvent, ReactNode } from "react";
import * as bs from "../../../bootstrap-aliases";
import { generateBadge } from "../../../helpers/formatters";
import { combine } from "../../../helpers/style-helpers";

interface IControlledCheckboxInputProps {
	id: string;
	label: string | ReactNode;
	checked: boolean;
	onCheckedChange: (newValue: boolean, id: string) => void;
	disabled?: boolean;
	error?: string;
}

interface IControlledCheckboxInputState {
	hasBeenTouched: boolean;
}

class ControlledCheckboxInput extends Component<IControlledCheckboxInputProps, IControlledCheckboxInputState> {

	public constructor(props: IControlledCheckboxInputProps) {
		super(props);
		this.state = {
			hasBeenTouched: false,
		};

		this.handleBlur = this.handleBlur.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	public render() {
		const { id, label, checked, disabled, error } = this.props;
		const { hasBeenTouched } = this.state;
		return (
				<div className={bs.formCheck}>
					<input
							id={id}
							type="checkbox"
							checked={checked}
							className={combine(bs.formCheckInput, hasBeenTouched && error && bs.isInvalid)}
							disabled={disabled !== false}
							onChange={this.handleChange}
							onBlur={this.handleBlur}
					/>
					<label className={bs.formCheckLabel} htmlFor={id}>{label}</label>
					{error && <div className={bs.invalidFeedback}>{error}</div>}
				</div>
		);
	}

	private handleBlur() {
		this.setState({
			hasBeenTouched: true,
		});
	}

	private handleChange(event: FormEvent<HTMLInputElement>) {
		this.props.onCheckedChange(event.currentTarget.checked, this.props.id);
	}
}

export default ControlledCheckboxInput;
