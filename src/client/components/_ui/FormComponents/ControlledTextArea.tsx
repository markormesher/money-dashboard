import * as React from "react";
import { ChangeEvent, Component, FormEvent, InputHTMLAttributes, ReactNode } from "react";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";

interface IControlledTextAreaProps {
	id: string;
	label: string | ReactNode;
	placeholder?: string;
	value: string | number;
	onValueChange: (newValue: string, id: string) => void;
	disabled?: boolean;
	error?: string;
	inputProps?: Partial<InputHTMLAttributes<HTMLTextAreaElement>>;
}

interface IControlledTextAreaState {
	hasBeenTouched: boolean;
}

class ControlledTextArea extends Component<IControlledTextAreaProps, IControlledTextAreaState> {

	public constructor(props: IControlledTextAreaProps) {
		super(props);
		this.state = {
			hasBeenTouched: false,
		};

		this.handleBlur = this.handleBlur.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	public render() {
		const { id, label, placeholder, value, disabled, error, inputProps } = this.props;
		const { hasBeenTouched } = this.state;
		return (
				<>
					<label htmlFor={id}>{label}</label>
					<textarea
							id={id}
							name={id}
							onChange={this.handleChange}
							disabled={disabled !== false}
							className={combine(bs.formControl, hasBeenTouched && error && bs.isInvalid)}
							placeholder={placeholder || ""}
							value={value}
							onBlur={this.handleBlur}
							{...inputProps}
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

	private handleChange(event: FormEvent<HTMLTextAreaElement>) {
		this.props.onValueChange(event.currentTarget.value, this.props.id);
	}
}

export {
	ControlledTextArea,
};
