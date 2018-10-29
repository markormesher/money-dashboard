import * as React from "react";
import { FormEvent, PureComponent, ReactElement, ReactNode } from "react";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";

interface IControlledSelectInputProps {
	readonly id: string;
	readonly label: string | ReactElement<void>;
	readonly value: string;
	readonly onValueChange: (newValue: string, id: string) => void;
	readonly disabled?: boolean;
	readonly error?: string;
}

interface IControlledSelectInputState {
	readonly hasBeenTouched: boolean;
}

class ControlledSelectInput extends PureComponent<IControlledSelectInputProps, IControlledSelectInputState> {

	public constructor(props: IControlledSelectInputProps) {
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
					<select
							id={id}
							name={id}
							onChange={this.handleChange}
							disabled={disabled !== false}
							className={combine(bs.formControl, hasBeenTouched && error && bs.isInvalid)}
							value={value}
							onBlur={this.handleBlur}
					>
						{this.props.children}
					</select>
					{error && <div className={bs.invalidFeedback}>{error}</div>}
				</>
		);
	}

	private handleBlur(): void {
		this.setState({
			hasBeenTouched: true,
		});
	}

	private handleChange(event: FormEvent<HTMLSelectElement>): void {
		this.props.onValueChange(event.currentTarget.value, this.props.id);
	}
}

export {
	ControlledSelectInput,
};
