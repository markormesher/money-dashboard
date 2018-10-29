import { faCircleNotch, faExclamationTriangle, faTrash } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { IconBtn } from "../IconBtn/IconBtn";

interface IDeleteBtnProps<Payload> {
	readonly payload?: Payload;
	readonly onConfirmedClick?: (payload: Payload) => void;
	readonly btnProps?: React.HTMLProps<HTMLButtonElement>;
}

interface IDeleteBtnState {
	readonly triggered: boolean;
	readonly running: boolean;
}

class DeleteBtn<Payload> extends PureComponent<IDeleteBtnProps<Payload>, IDeleteBtnState> {

	private triggerExpiryTimeout: NodeJS.Timer = undefined;

	constructor(props: IDeleteBtnProps<Payload>) {
		super(props);
		this.state = {
			triggered: false,
			running: false,
		};

		this.handleClick = this.handleClick.bind(this);
	}

	public render(): ReactNode {
		const { btnProps, payload } = this.props;
		const { triggered, running } = this.state;

		const btnIcon = running ? faCircleNotch : (triggered ? faExclamationTriangle : faTrash);
		const btnText = running ? undefined : (triggered ? "Sure?" : "Delete");

		return (
				<IconBtn<Payload>
						icon={btnIcon}
						text={btnText}
						payload={payload}
						onClick={this.handleClick}
						btnProps={{
							...btnProps,
							disabled: (btnProps && btnProps.disabled) || running,
						}}
						iconProps={{
							spin: running,
						}}
				/>
		);
	}

	private handleClick(payload: Payload): void {
		const { triggered, running } = this.state;

		if (running) {
			return;
		}

		if (!triggered) {
			this.setState({ triggered: true });
			this.triggerExpiryTimeout = global.setTimeout(() => this.setState({ triggered: false }), 2000);
		} else {
			clearTimeout(this.triggerExpiryTimeout);
			this.setState({ running: true });
			if (this.props.onConfirmedClick) {
				this.props.onConfirmedClick(payload);
			}
		}
	}

}

export {
	DeleteBtn,
};
