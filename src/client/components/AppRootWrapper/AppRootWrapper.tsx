import * as React from "react";
import { Component } from "react";

import * as bs from "bootstrap/dist/css/bootstrap.css";

export class AppRootWrapper extends Component {
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
