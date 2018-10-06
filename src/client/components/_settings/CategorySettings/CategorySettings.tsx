import { faPencil } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinCategory } from "../../../../server/model-thins/ThinCategory";
import * as bs from "../../../bootstrap-aliases";
import { generateCategoryTypeBadge } from "../../../helpers/formatters";
import { combine } from "../../../helpers/style-helpers";
import { IRootState } from "../../../redux/root";
import { startDeleteCategory } from "../../../redux/settings/categories/actions";
import { DataTable } from "../../_ui/DataTable/DataTable";
import DeleteBtn from "../../_ui/DeleteBtn/DeleteBtn";
import * as appStyles from "../../App/App.scss";

interface ICategorySettingsProps {
	lastUpdate: number;
	actions?: {
		deleteCategory: (id: string) => AnyAction,
	};
}

function mapStateToProps(state: IRootState, props: ICategorySettingsProps): ICategorySettingsProps {
	return {
		...props,
		lastUpdate: state.settings.accounts.lastUpdate,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: ICategorySettingsProps): ICategorySettingsProps {
	return {
		...props,
		actions: {
			deleteCategory: (id) => dispatch(startDeleteCategory(id)),
		},
	};
}

class CategorySettings extends Component<ICategorySettingsProps> {

	public render() {
		const { lastUpdate } = this.props;
		return (
				<>
					<h1 className={bs.h2}>Categories</h1>
					<DataTable<ThinCategory>
							api={"/settings/categories/table-data"}
							columns={[
								{ title: "Name", sortField: "name", defaultSortDirection: "asc" },
								{ title: "Type", sortable: false },
								{ title: "Actions", sortable: false },
							]}
							apiExtraParams={{ lastUpdate }}
							rowRenderer={(category: ThinCategory) => (
									<tr key={category.id}>
										<td>{category.name}</td>
										<td>{generateCategoryTypeBadge(category)}</td>
										<td>{this.generateActionButtons(category)}</td>
									</tr>
							)}
					/>
				</>
		);
	}

	private generateActionButtons(category: ThinCategory) {
		return (
				<div className={combine(bs.btnGroup, bs.btnGroupSm)}>
					<button className={combine(bs.btn, bs.btnOutlineDark, appStyles.btnMini)}>
						<FontAwesomeIcon icon={faPencil} fixedWidth={true}/> Edit
					</button>
					<DeleteBtn
							btnClassNames={combine(bs.btnOutlineDark, appStyles.btnMini)}
							onClick={() => this.props.actions.deleteCategory(category.id)}/>
				</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CategorySettings);
