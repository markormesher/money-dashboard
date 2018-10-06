import { faPencil } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinAccount } from "../../../server/model-thins/ThinAccount";
import * as bs from "../../bootstrap-aliases";
import { generateAccountTypeBadge } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { IRootState } from "../../redux/root";
import { startDeleteAccount } from "../../redux/settings/accounts/actions";
import CheckboxBtn from "../_ui/CheckboxBtn/CheckboxBtn";
import { DataTable } from "../_ui/DataTable/DataTable";
import DeleteBtn from "../_ui/DeleteBtn/DeleteBtn";
import * as appStyles from "../App/App.scss";

interface IAccountSettingsProps {
	lastUpdate: number;
	actions?: {
		deleteAccount: (id: string) => AnyAction,
	};
}

interface IAccountSettingsState {
	activeOnly: boolean;
}

function mapStateToProps(state: IRootState, props: IAccountSettingsProps): IAccountSettingsProps {
	return {
		...props,
		lastUpdate: state.settings.accounts.lastUpdate,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IAccountSettingsProps): IAccountSettingsProps {
	return {
		...props,
		actions: {
			deleteAccount: (id) => dispatch(startDeleteAccount(id)),
		},
	};
}

class AccountSettings extends Component<IAccountSettingsProps, IAccountSettingsState> {

	constructor(props: IAccountSettingsProps) {
		super(props);
		this.state = {
			activeOnly: true,
		};

		this.toggleActiveOnly = this.toggleActiveOnly.bind(this);
	}

	public render() {
		const { lastUpdate } = this.props;
		const { activeOnly } = this.state;
		return (
				<>
					<div className={appStyles.headerWrapper}>
						<h1 className={combine(bs.h2, bs.floatLeft)}>Accounts</h1>
						<div className={combine(bs.btnGroupSm, bs.floatRight)}>
							<CheckboxBtn
									initiallyChecked={true}
									onChange={this.toggleActiveOnly}
									btnClassNames={combine(bs.btnOutlineInfo, bs.btnSm)}>
								Active Accounts Only
							</CheckboxBtn>
						</div>
					</div>
					<DataTable<ThinAccount>
							api={"/settings/accounts/table-data"}
							columns={[
								{ title: "Name", sortField: "name", defaultSortDirection: "asc" },
								{ title: "Type", sortField: "type" },
								{ title: "Actions", sortable: false },
							]}
							apiExtraParams={{ activeOnly, lastUpdate }}
							rowRenderer={(account: ThinAccount) => (
									<tr key={account.id}>
										<td>{account.name}</td>
										<td>{generateAccountTypeBadge(account)}</td>
										<td>{this.generateActionButtons(account)}</td>
									</tr>
							)}
					/>
				</>
		);
	}

	private generateActionButtons(account: ThinAccount) {
		return (
				<div className={combine(bs.btnGroup, bs.btnGroupSm)}>
					<button className={combine(bs.btn, bs.btnOutlineDark, appStyles.btnMini)}>
						<FontAwesomeIcon icon={faPencil} fixedWidth={true}/> Edit
					</button>
					<DeleteBtn
							btnClassNames={combine(bs.btnOutlineDark, appStyles.btnMini)}
							onClick={() => this.props.actions.deleteAccount(account.id)}/>
				</div>
		);
	}

	private toggleActiveOnly(activeOnly: boolean) {
		this.setState({ activeOnly });
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);
