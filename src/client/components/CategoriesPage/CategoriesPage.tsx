import * as React from "react";
import { ReactElement, useState } from "react";
import { DEFAULT_CATEGORY, ICategory, mapCategoryFromApi } from "../../../models/ICategory";
import * as bs from "../../global-styles/Bootstrap.scss";
import { generateCategoryTypeBadge } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { ApiDataTableDataProvider } from "../_ui/DataTable/DataProvider/ApiDataTableDataProvider";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import { KeyShortcut } from "../_ui/KeyShortcut/KeyShortcut";
import { CategoryEditModal } from "../CategoryEditModal/CategoryEditModal";
import { PageHeader, PageHeaderActions } from "../_ui/PageHeader/PageHeader";
import { Card } from "../_ui/Card/Card";
import { useNonceState } from "../../helpers/state-hooks";
import { CategoryApi } from "../../api/categories";
import { globalErrorManager } from "../../helpers/errors/error-manager";

function CategoriesPage(): ReactElement {
  // state
  const [nonce, updateNonce] = useNonceState();
  const [categoryToEdit, setCategoryToEdit] = useState<ICategory>(null);

  // data table
  const tableColumns: IColumn[] = [
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

  const dataProvider = new ApiDataTableDataProvider<ICategory>(
    "/api/categories/table-data",
    () => ({ nonce }),
    mapCategoryFromApi,
  );

  function tableRowRenderer(category: ICategory): ReactElement<void> {
    return (
      <tr key={category.id}>
        <td>{category.name}</td>
        <td>{generateCategoryTypeBadge(category)}</td>
        <td>{generateActionButtons(category)}</td>
      </tr>
    );
  }

  function generateActionButtons(category: ICategory): ReactElement<void> {
    return (
      <div className={combine(bs.btnGroup, bs.btnGroupSm)}>
        <IconBtn
          icon={"edit"}
          text={"Edit"}
          payload={category}
          onClick={editCategory}
          btnProps={{
            className: bs.btnOutlineDark,
          }}
        />
        <DeleteBtn
          payload={category}
          onConfirmedClick={deleteCategory}
          btnProps={{
            className: bs.btnOutlineDark,
          }}
        />
      </div>
    );
  }

  // category actions
  function createCategory(): void {
    setCategoryToEdit(DEFAULT_CATEGORY);
  }

  function editCategory(category: ICategory): void {
    setCategoryToEdit(category);
  }

  function onEditCancel(): void {
    setCategoryToEdit(null);
  }

  function onEditComplete(): void {
    setCategoryToEdit(null);
    updateNonce();
  }

  async function deleteCategory(category: ICategory): Promise<void> {
    try {
      await CategoryApi.deleteCategory(category);
      updateNonce();
    } catch (error) {
      globalErrorManager.emitNonFatalError("Failed to delete category", error);
    }
  }

  return (
    <>
      {categoryToEdit ? (
        <CategoryEditModal categoryToEdit={categoryToEdit} onCancel={onEditCancel} onComplete={onEditComplete} />
      ) : null}

      <PageHeader>
        <h2>Categories</h2>
        <PageHeaderActions>
          <KeyShortcut targetStr={"c"} onTrigger={createCategory}>
            <IconBtn
              icon={"add"}
              text={"New Category"}
              onClick={createCategory}
              btnProps={{
                className: combine(bs.btnSm, bs.btnSuccess),
              }}
            />
          </KeyShortcut>
        </PageHeaderActions>
      </PageHeader>

      <Card>
        <DataTable<ICategory>
          columns={tableColumns}
          dataProvider={dataProvider}
          rowRenderer={tableRowRenderer}
          watchedProps={{ nonce }}
        />
      </Card>
    </>
  );
}

export { CategoriesPage };
