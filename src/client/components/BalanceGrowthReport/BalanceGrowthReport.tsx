import * as React from "react";
import { PureComponent, ReactNode } from "react";
import * as bs from "../../bootstrap-aliases";

class BalanceGrowthReport extends PureComponent {
	public render(): ReactNode {
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
