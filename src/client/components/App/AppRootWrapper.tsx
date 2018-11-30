import * as React from "react";
import { PureComponent, ReactNode } from "react";
import * as bs from "../../global-styles/Bootstrap.scss";

class AppRootWrapper extends PureComponent {
	public render(): ReactNode {
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
