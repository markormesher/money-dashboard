import { faCircleNotch, faExclamationTriangle, faTrash } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { Component } from "react";
import IconBtn from "../IconBtn/IconBtn";

interface IDeleteBtnProps {
	onConfirmedClick?: () => void;
	btnProps?: React.HTMLProps<HTMLButtonElement>;
}

interface IDeleteBtnState {
	triggered: boolean;
	running: boolean;
}

class DeleteBtn extends Component<IDeleteBtnProps, IDeleteBtnState> {

	private triggerExpiryTimeout: NodeJS.Timer = undefined;

	constructor(props: IDeleteBtnProps) {
		super(props);
		this.state = {
			triggered: false,
			running: false,
		};

		this.handleClick = this.handleClick.bind(this);
	}

	public render() {
		const { btnProps } = this.props;
		const { triggered, running } = this.state;

		const btnIcon = running ? faCircleNotch : (triggered ? faExclamationTriangle : faTrash);
		const btnText = running ? undefined : (triggered ? "Sure?" : "Delete");

		return (
				<IconBtn
						icon={btnIcon}
						text={btnText}
						btnProps={{
							...btnProps,
							onClick: this.handleClick,
							disabled: (btnProps && btnProps.disabled) || running,
						}}
						iconProps={{
							spin: running,
						}}
				/>
		);
	}

	private handleClick() {
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
				this.props.onConfirmedClick();
			}
		}
	}

}

export default DeleteBtn;
