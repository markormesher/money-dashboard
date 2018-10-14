import * as React from "react";
import { Component, FormEvent, ReactNode } from "react";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";

interface IControlledDateInputProps {
	id: string;
	label: string | ReactNode;
	value: string | number;
	onValueChange: (newValue: string, id: string) => void;
	disabled?: boolean;
	error?: string;
}

interface IControlledDateInputState {
	hasBeenTouched: boolean;
}

class ControlledDateInput extends Component<IControlledDateInputProps, IControlledDateInputState> {

	public constructor(props: IControlledDateInputProps) {
		super(props);
		this.state = {
			hasBeenTouched: false,
		};

		this.handleBlur = this.handleBlur.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	public render() {
		const { id, label, value, disabled, error } = this.props;
		const { hasBeenTouched } = this.state;
		return (
				<>
					<label htmlFor={id}>{label}</label>
					<input
							id={id}
							name={id}
							type="date"
							onChange={this.handleChange}
							disabled={disabled !== false}
							className={combine(bs.formControl, hasBeenTouched && error && bs.isInvalid)}
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
		const newValue = event.currentTarget.value;
		if (!newValue || newValue.trim() === "") {
			this.props.onValueChange(undefined, this.props.id);
		} else {
			this.props.onValueChange(event.currentTarget.value, this.props.id);
		}
	}
}

export {
	ControlledDateInput,
};
