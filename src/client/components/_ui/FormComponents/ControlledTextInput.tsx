import * as React from "react";
import { Component, FormEvent, ReactNode } from "react";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";

interface IControlledTextInputProps {
	id: string;
	label: string | ReactNode;
	placeholder: string;
	value: string;
	onValueChange: (newValue: string, id: string) => void;
	disabled?: boolean;
	error?: string;
}

interface IControlledTextInputState {
	hasBeenTouched: boolean;
}

class ControlledTextInput extends Component<IControlledTextInputProps, IControlledTextInputState> {

	public constructor(props: IControlledTextInputProps) {
		super(props);
		this.state = {
			hasBeenTouched: false,
		};

		this.handleBlur = this.handleBlur.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	public render() {
		const { id, label, placeholder, value, disabled, error } = this.props;
		const { hasBeenTouched } = this.state;
		return (
				<>
					<label htmlFor={id}>{label}</label>
					<input
							id={id}
							name={id}
							type="text"
							onChange={this.handleChange}
							disabled={disabled !== false}
							className={combine(bs.formControl, hasBeenTouched && error && bs.isInvalid)}
							placeholder={placeholder}
							value={value}
							onBlur={this.handleBlur}
					/>
					{error && <div className={bs.invalidFeedback}>{error}</div>}
				</>
		);
	}

	private handleBlur() {
		this.setState({
			hasBeenTouched: true,
		});
	}

	private handleChange(event: FormEvent<HTMLInputElement>) {
		this.props.onValueChange(event.currentTarget.value, this.props.id);
	}
}

export default ControlledTextInput;
