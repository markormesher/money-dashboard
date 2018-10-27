import * as React from "react";
import { FormEvent, PureComponent, ReactNode } from "react";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";

interface IControlledRadioInputProps {
	readonly id: string;
	readonly name: string;
	readonly value: string;
	readonly label: string | ReactNode;
	readonly checked: boolean;
	readonly onValueChange: (newValue: string, id: string) => void;
	readonly disabled?: boolean;
	readonly error?: string;
}

interface IControlledRadioInputState {
	readonly hasBeenTouched: boolean;
}

class ControlledRadioInput extends PureComponent<IControlledRadioInputProps, IControlledRadioInputState> {

	public constructor(props: IControlledRadioInputProps) {
		super(props);
		this.state = {
			hasBeenTouched: false,
		};

		this.handleBlur = this.handleBlur.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	public render() {
		const { id, name, value, label, checked, disabled, error } = this.props;
		const { hasBeenTouched } = this.state;
		return (
				<div className={bs.formCheck}>
					<input
							id={id}
							name={name}
							value={value}
							type="radio"
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
		if (event.currentTarget.checked) {
			this.props.onValueChange(event.currentTarget.value, this.props.id);
		}
	}
}

export {
	ControlledRadioInput,
};
