import { faCircleNotch, faExclamationTriangle, faTrash } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Component } from "react";
import { run } from "tslint/lib/runner";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";

interface IDeleteBtnProps {
	btnClassNames?: string;
	onClick?: () => void;
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
		const { btnClassNames } = this.props;
		const { triggered, running } = this.state;

		const btnIcon = running ? faCircleNotch : (triggered ? faExclamationTriangle : faTrash);
		const btnText = running ? undefined : (triggered ? "Sure?" : "Delete");

		return (
				<button className={combine(bs.btn, btnClassNames)} onClick={this.handleClick}>
					<FontAwesomeIcon icon={btnIcon} fixedWidth={triggered} spin={running}/> {btnText}
				</button>
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
			if (this.props.onClick) {
				this.props.onClick();
			}
		}
	}

}

export default DeleteBtn;
