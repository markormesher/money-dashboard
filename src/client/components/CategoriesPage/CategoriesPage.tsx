import { faPencil, faPlus } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { PureComponent, ReactElement, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { ICategory, mapCategoryFromApi } from "../../../models/ICategory";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { generateCategoryTypeBadge } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { CategoryCacheKeys, setCategoryToEdit, startDeleteCategory } from "../../redux/categories";
import { IRootState } from "../../redux/root";
import { ApiDataTableDataProvider } from "../_ui/DataTable/DataProvider/ApiDataTableDataProvider";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import { KeyShortcut } from "../_ui/KeyShortcut/KeyShortcut";
import { CategoryEditModal } from "../CategoryEditModal/CategoryEditModal";
import { PageHeader, PageHeaderActions } from "../_ui/PageHeader/PageHeader";
import { Card } from "../_ui/Card/Card";
import { IProfileAwareProps, mapStateToProfileAwareProps } from "../../redux/profiles";

interface ICategoriesPageProps extends IProfileAwareProps {
  readonly cacheTime: number;
  readonly categoryToEdit?: ICategory;
  readonly actions?: {
    readonly deleteCategory: (category: ICategory) => AnyAction;
    readonly setCategoryToEdit: (category: ICategory) => AnyAction;
  };
}

function mapStateToProps(state: IRootState, props: ICategoriesPageProps): ICategoriesPageProps {
  return {
    ...mapStateToProfileAwareProps(state),
    ...props,
    cacheTime: CacheKeyUtil.getKeyTime(CategoryCacheKeys.CATEGORY_DATA),
    categoryToEdit: state.categories.categoryToEdit,
  };
}

function mapDispatchToProps(dispatch: Dispatch, props: ICategoriesPageProps): ICategoriesPageProps {
  return {
    ...props,
    actions: {
      deleteCategory: (category): AnyAction => dispatch(startDeleteCategory(category)),
      setCategoryToEdit: (category): AnyAction => dispatch(setCategoryToEdit(category)),
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
    const { cacheTime, activeProfile, categoryToEdit } = this.props;

    return (
      <>
        {categoryToEdit !== undefined && <CategoryEditModal />}

        <PageHeader>
          <h2>Categories</h2>
          <PageHeaderActions>
            <KeyShortcut targetStr={"c"} onTrigger={this.startCategoryCreation}>
              <IconBtn
                icon={faPlus}
                text={"New Category"}
                onClick={this.startCategoryCreation}
                btnProps={{
                  className: combine(bs.btnSm, bs.btnSuccess),
                }}
              />
            </KeyShortcut>
          </PageHeaderActions>
        </PageHeader>

        <Card>
          <DataTable<ICategory>
            columns={this.tableColumns}
            dataProvider={this.dataProvider}
            rowRenderer={this.tableRowRenderer}
            watchedProps={{ cacheTime, activeProfile }}
          />
        </Card>
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
