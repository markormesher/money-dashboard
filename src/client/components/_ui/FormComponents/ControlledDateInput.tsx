import * as React from "react";
import { FormEvent, PureComponent, ReactElement, ReactNode } from "react";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";

interface IControlledDateInputProps {
	readonly id: string;
	readonly label: string | ReactElement<void>;
	readonly value: string | number;
	readonly onValueChange: (newValue: string, id: string) => void;
	readonly disabled?: boolean;
	readonly error?: string;
}

interface IControlledDateInputState {
	readonly hasBeenTouched: boolean;
}

class ControlledDateInput extends PureComponent<IControlledDateInputProps, IControlledDateInputState> {

	public constructor(props: IControlledDateInputProps) {
		super(props);
		this.state = {
			hasBeenTouched: false,
		};

		this.handleBlur = this.handleBlur.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	public render(): ReactNode {
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

	private handleBlur(): void {
		this.setState({
			hasBeenTouched: true,
		});
	}

	private handleChange(event: FormEvent<HTMLInputElement>): void {
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
