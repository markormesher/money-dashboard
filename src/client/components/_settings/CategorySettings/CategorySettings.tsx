import { faPencil, faTrash } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Component } from "react";
import { ThinCategory } from "../../../../server/model-thins/ThinCategory";
import * as bs from "../../../bootstrap-aliases";
import { generateCategoryTypeBadge } from "../../../helpers/formatters";
import { combine } from "../../../helpers/style-helpers";
import { DataTable } from "../../_ui/DataTable/DataTable";
import * as appStyles from "../../App/App.scss";

class CategorySettings extends Component {

	private static generateActionButtons(category: ThinCategory) {
		return (
				<div className={combine(bs.btnGroup, bs.btnGroupSm)}>
					<button className={combine(bs.btn, bs.btnOutlineDark, appStyles.btnMini)}>
						<FontAwesomeIcon icon={faPencil} fixedWidth={true}/> Edit
					</button>
					<button className={combine(bs.btn, bs.btnOutlineDark, appStyles.btnMini)}>
						<FontAwesomeIcon icon={faTrash} fixedWidth={true}/> Delete
					</button>
				</div>
		);
	}

	public render() {
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
							rowRenderer={(category: ThinCategory) => (
									<tr key={category.id}>
										<td>{category.name}</td>
										<td>{generateCategoryTypeBadge(category)}</td>
										<td>{CategorySettings.generateActionButtons(category)}</td>
									</tr>
							)}
					/>
				</>
		);
	}
}

export default CategorySettings;
