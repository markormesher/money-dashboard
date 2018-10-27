import * as React from "react";
import { PureComponent } from "react";
import * as bs from "../../bootstrap-aliases";

class BalanceGrowthReport extends PureComponent {
	public render() {
		return (
				<div>
					<h1 className={bs.h2}>Balance Growth</h1>
				</div>
		);
	}
}

export {
	BalanceGrowthReport,
};
