import { faPencil, faPlus } from "@fortawesome/pro-light-svg-icons";
import { Component } from "react";
import * as React from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinCategory } from "../../../server/model-thins/ThinCategory";
import * as bs from "../../bootstrap-aliases";
import { generateCategoryTypeBadge } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { IRootState } from "../../redux/root";
import { setCategoryToEdit, startDeleteCategory } from "../../redux/settings/categories/actions";
import { DataTable } from "../_ui/DataTable/DataTable";
import DeleteBtn from "../_ui/DeleteBtn/DeleteBtn";
import IconBtn from "../_ui/IconBtn/IconBtn";
import * as appStyles from "../App/App.scss";
import EditCategoryModal from "./EditCategoryModal";

interface ICategorySettingsProps {
	lastUpdate: number;
	actions?: {
		deleteCategory: (id: string) => AnyAction,
		setCategoryToEdit: (category: ThinCategory) => AnyAction,
	};
}

function mapStateToProps(state: IRootState, props: ICategorySettingsProps): ICategorySettingsProps {
	return {
		...props,
		lastUpdate: state.settings.categories.lastUpdate,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: ICategorySettingsProps): ICategorySettingsProps {
	return {
		...props,
		actions: {
			deleteCategory: (id) => dispatch(startDeleteCategory(id)),
			setCategoryToEdit: (category) => dispatch(setCategoryToEdit(category)),
		},
	};
}

class CategorySettings extends Component<ICategorySettingsProps> {

	public render() {
		const { lastUpdate } = this.props;
		return (
				<>
					<EditCategoryModal/>

					<div className={appStyles.headerWrapper}>
						<h1 className={combine(bs.h2, bs.floatLeft)}>Categories</h1>

						<IconBtn
								icon={faPlus}
								text={"New Category"}
								btnProps={{
									className: combine(bs.floatRight, bs.btnSm, bs.btnSuccess),
									onClick: () => this.props.actions.setCategoryToEdit(null),
								}}
						/>
					</div>

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
					<IconBtn
							icon={faPencil}
							text={"Edit"}
							btnProps={{
								className: combine(bs.btnOutlineDark, appStyles.btnMini),
								onClick: () => this.props.actions.setCategoryToEdit(category),
							}}
					/>
					<DeleteBtn
							onConfirmedClick={() => this.props.actions.deleteCategory(category.id)}
							btnProps={{
								className: combine(bs.btnOutlineDark, appStyles.btnMini),
							}}
					/>
				</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CategorySettings);
