import * as React from "react";
import { Component } from "react";
import { CSSTransition } from "react-transition-group";
import * as bs from "../../../bootstrap-aliases";

interface IBootstrapFadeWrapper {
	in: boolean;
	mountOnEnter?: boolean;
	unmountOnExit?: boolean;
}

class BootstrapFadeWrapper extends Component<IBootstrapFadeWrapper> {
	public render() {
		return (
				<CSSTransition
						timeout={150}
						in={this.props.in}
						mountOnEnter={this.props.mountOnEnter !== false} // makes "undefined" into true
						unmountOnExit={this.props.unmountOnExit !== false} // makes "undefined" into true
						classNames={{
							enterActive: bs.show,
							enterDone: bs.show,
						}}
				>
					{this.props.children}
				</CSSTransition>
		);
	}
}

export default BootstrapFadeWrapper;
