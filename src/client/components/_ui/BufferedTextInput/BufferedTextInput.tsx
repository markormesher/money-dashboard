import * as React from "react";
import { Component, ReactElement } from "react";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";

interface IBufferedTextInputProps {
	readonly placeholder?: string;
	readonly disabled?: boolean;
	readonly delay?: number;
	readonly onValueChange?: (value: string) => void;
}

class BufferedTextInput extends Component<IBufferedTextInputProps> {

	private valueChangeTimeout: NodeJS.Timer = undefined;

	constructor(props: IBufferedTextInputProps, context: any) {
		super(props, context);

		this.handleValueChange = this.handleValueChange.bind(this);
	}

	public render(): ReactElement<void> {
		const { placeholder, disabled } = this.props;
		return (
				<input
						placeholder={placeholder}
						disabled={disabled}
						className={combine(bs.formControl, bs.formControlSm)}
						onKeyUp={this.handleValueChange}
				/>
		);
	}

	private handleValueChange(event: React.KeyboardEvent): void {
		const { delay, onValueChange } = this.props;
		clearTimeout(this.valueChangeTimeout);
		const searchTerm = (event.target as HTMLInputElement).value;
		this.valueChangeTimeout = global.setTimeout(() => onValueChange(searchTerm), delay || 200);
	}
}

export {
	BufferedTextInput,
};
