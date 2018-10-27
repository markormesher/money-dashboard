import * as React from "react";
import { PureComponent } from "react";
import * as bs from "../../../bootstrap-aliases";

class AppRootWrapper extends PureComponent {
	public render() {
		return (
				<div className={bs.containerFluid}>
					<div className={bs.row}>
						{this.props.children}
					</div>
				</div>
		);
	}
}

export {
	AppRootWrapper,
};
