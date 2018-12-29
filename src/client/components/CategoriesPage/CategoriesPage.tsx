import { faPencil, faPlus } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { PureComponent, ReactElement, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ICategory, mapCategoryFromApi } from "../../../commons/models/ICategory";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { generateCategoryTypeBadge } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { CategoryCacheKeys, setCategoryToEdit, startDeleteCategory } from "../../redux/categories";
import { KeyCache } from "../../redux/helpers/KeyCache";
import { IRootState } from "../../redux/root";
import { ApiDataTableDataProvider } from "../_ui/DataTable/DataProvider/ApiDataTableDataProvider";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import { KeyShortcut } from "../_ui/KeyShortcut/KeyShortcut";
import { CategoryEditModal } from "../CategoryEditModal/CategoryEditModal";

interface ICategoriesPageProps {
	readonly cacheTime: number;
	readonly categoryToEdit?: ICategory;
	readonly actions?: {
		readonly deleteCategory: (category: ICategory) => AnyAction,
		readonly setCategoryToEdit: (category: ICategory) => AnyAction,
	};
}

function mapStateToProps(state: IRootState, props: ICategoriesPageProps): ICategoriesPageProps {
	return {
		...props,
		cacheTime: KeyCache.getKeyTime(CategoryCacheKeys.CATEGORY_DATA),
		categoryToEdit: state.categories.categoryToEdit,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: ICategoriesPageProps): ICategoriesPageProps {
	return {
		...props,
		actions: {
			deleteCategory: (category) => dispatch(startDeleteCategory(category)),
			setCategoryToEdit: (category) => dispatch(setCategoryToEdit(category)),
		},
	};
}

class UCCategoriesPage extends PureComponent<ICategoriesPageProps> {

	private tableColumns: IColumn[] = [
		{
			title: "Name",
			sortField: "category.name",
			defaultSortDirection: "ASC",
		},
		{
			title: "Type",
			sortable: false,
		},
		{
			title: "Actions",
			sortable: false,
		},
	];

	private dataProvider = new ApiDataTableDataProvider<ICategory>(
			"/api/categories/table-data",
			() => ({
				cacheTime: this.props.cacheTime,
			}),
			mapCategoryFromApi,
	);

	constructor(props: ICategoriesPageProps) {
		super(props);

		this.tableRowRenderer = this.tableRowRenderer.bind(this);
		this.generateActionButtons = this.generateActionButtons.bind(this);
		this.startCategoryCreation = this.startCategoryCreation.bind(this);
	}

	public render(): ReactNode {
		const { cacheTime, categoryToEdit } = this.props;

		return (
				<>
					{categoryToEdit !== undefined && <CategoryEditModal/>}

					<div className={gs.headerWrapper}>
						<h1 className={bs.h2}>Categories</h1>
						<div className={gs.headerExtras}>
							<KeyShortcut
									targetStr={"c"}
									onTrigger={this.startCategoryCreation}
							>
								<IconBtn
										icon={faPlus}
										text={"New Category"}
										onClick={this.startCategoryCreation}
										btnProps={{
											className: combine(bs.btnSm, bs.btnSuccess),
										}}
								/>
							</KeyShortcut>
						</div>
					</div>

					<DataTable<ICategory>
							columns={this.tableColumns}
							dataProvider={this.dataProvider}
							rowRenderer={this.tableRowRenderer}
							watchedProps={{ cacheTime }}
					/>
				</>
		);
	}

	private tableRowRenderer(category: ICategory): ReactElement<void> {
		return (
				<tr key={category.id}>
					<td>{category.name}</td>
					<td>{generateCategoryTypeBadge(category)}</td>
					<td>{this.generateActionButtons(category)}</td>
				</tr>
		);
	}

	private generateActionButtons(category: ICategory): ReactElement<void> {
		return (
				<div className={combine(bs.btnGroup, bs.btnGroupSm)}>
					<IconBtn
							icon={faPencil}
							text={"Edit"}
							payload={category}
							onClick={this.props.actions.setCategoryToEdit}
							btnProps={{
								className: combine(bs.btnOutlineDark, gs.btnMini),
							}}
					/>
					<DeleteBtn
							payload={category}
							onConfirmedClick={this.props.actions.deleteCategory}
							btnProps={{
								className: combine(bs.btnOutlineDark, gs.btnMini),
							}}
					/>
				</div>
		);
	}

	private startCategoryCreation(): void {
		this.props.actions.setCategoryToEdit(null);
	}
}

export const CategoriesPage = connect(mapStateToProps, mapDispatchToProps)(UCCategoriesPage);
