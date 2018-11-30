import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { PureComponent, ReactElement, ReactNode } from "react";
import { ICategoryBalance } from "../../../server/model-thins/ICategoryBalance";
import * as bs from "../../global-styles/Bootstrap.scss";
import { formatCurrencyStyled } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";

interface IDashboardAlertListProps {
	readonly memoCategoryBalances?: ICategoryBalance[];
}

class DashboardAlertList extends PureComponent<IDashboardAlertListProps> {

	private static renderSingleAlert(key: string, msg: string | ReactElement<void>): ReactNode {
		return (
				<div key={key} className={combine(bs.alert, bs.alertDanger, bs.mb3)}>
					<FontAwesomeIcon icon={faExclamationTriangle} className={bs.mr2}/>
					{msg}
				</div>
		);
	}

	public render(): ReactNode {
		if (!this.props.memoCategoryBalances) {
			return null;
		}

		const nonZeroMemos = this.props.memoCategoryBalances
				.filter((mcb) => mcb.balance !== 0)
				.map((m) => DashboardAlertList.renderSingleAlert(
						`memo-balance-${m.category.id}`,
						<>{m.category.name} balance is {formatCurrencyStyled(m.balance)}.</>,
				));

		return (
				<>
					{nonZeroMemos}
				</>
		);
	}
}

export {
	DashboardAlertList,
};
