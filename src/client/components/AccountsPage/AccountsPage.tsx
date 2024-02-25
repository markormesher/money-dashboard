import * as React from "react";
import { ReactElement } from "react";
import { DEFAULT_ACCOUNT, IAccount, mapAccountFromApi } from "../../../models/IAccount";
import bs from "../../global-styles/Bootstrap.scss";
import { generateAccountTypeBadge } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { CheckboxBtn } from "../_ui/CheckboxBtn/CheckboxBtn";
import { ApiDataTableDataProvider } from "../_ui/DataTable/DataProvider/ApiDataTableDataProvider";
import { DataTable, Column } from "../_ui/DataTable/DataTable";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import { KeyShortcut } from "../_ui/KeyShortcut/KeyShortcut";
import { AccountEditModal } from "../AccountEditModal/AccountEditModal";
import { InfoIcon } from "../_ui/InfoIcon/InfoIcon";
import { PageHeader, PageHeaderActions } from "../_ui/PageHeader/PageHeader";
import { PageOptions } from "../_ui/PageOptions/PageOptions";
import { Card } from "../_ui/Card/Card";
import { DEFAULT_CURRENCY_CODE } from "../../../models/ICurrency";
import { Badge } from "../_ui/Badge/Badge";
import { useNonceState } from "../../helpers/state-hooks";
import { globalErrorManager } from "../../helpers/errors/error-manager";
import { AccountApi } from "../../api/accounts";

function AccountsPage(): ReactElement {
  // state
  const [nonce, updateNonce] = useNonceState();
  const [accountToEdit, setAccountToEdit] = React.useState<IAccount>();
  const [showActiveOnly, setShowActiveOnly] = React.useState(true);

  // data table
  const tableColumns: Column[] = [
    {
      title: "Name",
      sortField: "account.name",
      defaultSortDirection: "ASC",
    },
    {
      title: "Type",
      sortField: "account.type",
    },
    {
      title: "Actions",
      sortable: false,
    },
  ];

  const dataProvider = new ApiDataTableDataProvider<IAccount>(
    "/api/accounts/table-data",
    () => ({
      cacheTime: nonce,
      activeOnly: showActiveOnly,
    }),
    mapAccountFromApi,
  );

  function tableRowRenderer(account: IAccount): ReactElement<void> {
    return (
      <tr key={account.id}>
        <td>
          {account.name}
          {!account.active ? <Badge className={combine(bs.bgDark, bs.ms2)}>Inactive</Badge> : null}
          {account.note && (
            <span className={bs.ms2}>
              <InfoIcon hoverText={account.note} />
            </span>
          )}
          {account.currencyCode !== DEFAULT_CURRENCY_CODE && (
            <Badge className={combine(bs.bgDark, bs.ms2)}>{account.currencyCode}</Badge>
          )}
          {account.stockTicker !== null && <Badge className={combine(bs.bgDark, bs.ms2)}>{account.stockTicker}</Badge>}
        </td>
        <td>{generateAccountTypeBadge(account)}</td>
        <td>{generateActionButtons(account)}</td>
      </tr>
    );
  }

  function generateActionButtons(account: IAccount): ReactElement<void> {
    return (
      <div className={combine(bs.btnGroup, bs.btnGroupSm)}>
        <IconBtn
          icon={"edit"}
          text={"Edit"}
          payload={account}
          onClick={editAccount}
          btnProps={{
            className: bs.btnOutlineDark,
          }}
        />
        <DeleteBtn
          payload={account}
          onConfirmedClick={deleteAccount}
          btnProps={{
            className: bs.btnOutlineDark,
          }}
        />
      </div>
    );
  }

  // account actions
  function createAccount(): void {
    setAccountToEdit(DEFAULT_ACCOUNT);
  }

  function editAccount(account?: IAccount): void {
    setAccountToEdit(account);
  }

  function onEditCancel(): void {
    setAccountToEdit(undefined);
  }

  function onEditComplete(): void {
    setAccountToEdit(undefined);
    updateNonce();
  }

  async function deleteAccount(account?: IAccount): Promise<void> {
    if (!account) {
      return;
    }

    try {
      await AccountApi.deleteAccount(account);
      updateNonce();
    } catch (error) {
      globalErrorManager.emitNonFatalError("Failed to delete account", error);
    }
  }

  return (
    <>
      {accountToEdit ? (
        <AccountEditModal accountToEdit={accountToEdit} onCancel={onEditCancel} onComplete={onEditComplete} />
      ) : null}

      <PageHeader>
        <h2>Accounts</h2>
        <PageHeaderActions>
          <KeyShortcut targetStr={"c"} onTrigger={createAccount}>
            <IconBtn
              icon={"add"}
              text={"New Account"}
              onClick={createAccount}
              btnProps={{
                className: combine(bs.btnSm, bs.btnSuccess),
              }}
            />
          </KeyShortcut>
        </PageHeaderActions>
      </PageHeader>

      <PageOptions>
        <CheckboxBtn
          text={"Active Accounts Only"}
          checked={showActiveOnly}
          onChange={(checked) => setShowActiveOnly(checked)}
          btnProps={{
            className: combine(bs.btnOutlineInfo, bs.btnSm),
          }}
        />
      </PageOptions>

      <Card>
        <DataTable<IAccount>
          columns={tableColumns}
          dataProvider={dataProvider}
          rowRenderer={tableRowRenderer}
          watchedProps={{ nonce, showActiveOnly }}
        />
      </Card>
    </>
  );
}

export { AccountsPage };
