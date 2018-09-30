import * as React from "react";
import { Component } from "react";
import * as bs from "../../bootstrap-aliases";
import { combine } from "../../helpers/style-helpers";

class AppContentWrapper extends Component {
	private mainWrapperClasses = combine(
			bs.colLg10, bs.mlSmAuto,
			bs.pt3, bs.px4,
	);
	private innerWrapperClasses = combine(
			bs.dFlex, bs.flexWrap, bs.flexMdNowrap,
			bs.justifyContentBetween, bs.alignItemsCenter,
			bs.pb2, bs.mb3,
	);

	public render() {
		return (
				<main role="main" className={this.mainWrapperClasses}>
					<div className={this.innerWrapperClasses}>
						{this.props.children}
					</div>
				</main>
		);
	}
}

export default AppContentWrapper;
