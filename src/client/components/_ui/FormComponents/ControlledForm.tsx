import { FormEvent } from "react";
import * as React from "react";
import { Component } from "react";

interface IControlledFormProps {
	onSubmit?: () => void;
}

class ControlledForm extends Component<IControlledFormProps> {

	constructor(props: IControlledFormProps) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	public render() {
		return (
				<form onSubmit={this.handleSubmit}>
					{this.props.children}
				</form>
		);
	}

	private handleSubmit(event?: FormEvent) {
		if (event) {
			event.preventDefault();
		}

		if (this.props.onSubmit) {
			this.props.onSubmit();
		}
	}
}

export {
	ControlledForm,
};
