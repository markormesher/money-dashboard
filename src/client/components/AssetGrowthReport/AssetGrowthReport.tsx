import * as React from "react";
import { PureComponent, ReactNode } from "react";
import * as bs from "../../global-styles/Bootstrap.scss";

class AssetGrowthReport extends PureComponent {
	public render(): ReactNode {
		return (
				<div>
					<h1 className={bs.h2}>Asset Growth</h1>
				</div>
		);
	}
}

export {
	AssetGrowthReport,
};
