import * as React from "react";
import { PureComponent, ReactNode } from "react";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";

class AppContentWrapper extends PureComponent {

	private static innerWrapperClasses = combine(
			bs.pb2, bs.mb3,
	);

	private static mainWrapperClasses = combine(
			bs.colLg10, bs.mlSmAuto,
			bs.pt3, bs.px4,
	);

	public render(): ReactNode {
		return (
				<main role="main" className={AppContentWrapper.mainWrapperClasses}>
					<div className={AppContentWrapper.innerWrapperClasses}>
						{this.props.children}
					</div>
				</main>
		);
	}
}

export {
	AppContentWrapper,
};
