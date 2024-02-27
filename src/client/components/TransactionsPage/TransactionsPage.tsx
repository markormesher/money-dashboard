import * as React from "react";
import { ReactElement } from "react";
import {
  DEFAULT_TRANSACTION,
  getNextTransactionForContinuousCreation,
  ITransaction,
  mapTransactionFromApi,
} from "../../../models/ITransaction";
import * as bs from "../../global-styles/Bootstrap.scss";
import { formatCurrencyStyled, formatDate } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { ApiDataTableDataProvider } from "../_ui/DataTable/DataProvider/ApiDataTableDataProvider";
import { DataTable, Column } from "../_ui/DataTable/DataTable";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import { InfoIcon } from "../_ui/InfoIcon/InfoIcon";
import { KeyShortcut } from "../_ui/KeyShortcut/KeyShortcut";
import { TransactionEditModal } from "../TransactionEditModal/TransactionEditModal";
import { PageHeader, PageHeaderActions } from "../_ui/PageHeader/PageHeader";
import { Card } from "../_ui/Card/Card";
import { DEFAULT_CURRENCY_CODE } from "../../../models/ICurrency";
import { Badge } from "../_ui/Badge/Badge";
import { globalErrorManager } from "../../helpers/errors/error-manager";
import { useNonceState } from "../../helpers/state-hooks";

function TransactionsPage(): ReactElement {
  // state
  const [nonce, updateNonce] = useNonceState();
  const [transactionToEdit, setTransactionToEdit] = React.useState<ITransaction>();

  // data table
  const tableColumns: Column[] = [
    {
      title: "Date",
      sortField: "transaction.transactionDate",
      defaultSortDirection: "DESC",
      defaultSortPriority: 0,
    },
    {
      title: "Account",
      sortField: "account.name",
    },
    {
      title: "Payee",
      sortField: "transaction.payee",
    },
    {
      title: "Amount",
      sortField: "transaction.amount",
    },
    {
      title: "Category",
      sortField: "category.name",
    },
    {
      title: "Actions",
      sortable: false,
    },
  ];

  const dataProvider = new ApiDataTableDataProvider<ITransaction>(
    "/api/transactions/table-data",
    () => ({
      cacheTime: nonce,
    }),
    mapTransactionFromApi,
  );

  function tableRowRenderer(transaction: ITransaction): ReactElement<void> {
    const mainDate = formatDate(transaction.transactionDate);
    const altDate = formatDate(transaction.effectiveDate);
    const altCurrencyCode =
      transaction.account.currencyCode !== DEFAULT_CURRENCY_CODE ? transaction.account.currencyCode : null;
    return (
      <tr key={transaction.id}>
        <td>
          {mainDate}
          {mainDate !== altDate && (
            <span className={bs.ms2}>
              <InfoIcon hoverText={altDate} />
            </span>
          )}
        </td>
        <td>{transaction.account.name}</td>
        <td>
          {transaction.payee}
          {transaction.note && (
            <span className={bs.ms2}>
              <InfoIcon hoverText={transaction.note} />
            </span>
          )}
        </td>
        <td>
          {formatCurrencyStyled(transaction.amount)}
          {altCurrencyCode && <Badge className={combine(bs.bgDark, bs.ms2)}>{altCurrencyCode}</Badge>}
        </td>
        <td>{transaction.category.name}</td>
        <td>{generateActionButtons(transaction)}</td>
      </tr>
    );
  }

  function generateActionButtons(transaction: ITransaction): ReactElement<void> {
    return (
      <div className={combine(bs.btnGroup, bs.btnGroupSm)}>
        <IconBtn
          icon={"edit"}
          text={"Edit"}
          payload={transaction}
          onClick={editTransaction}
          btnProps={{
            className: bs.btnOutlineDark,
            disabled: transaction.account.deleted || !transaction.account.active || transaction.category.deleted,
          }}
        />
        <DeleteBtn
          payload={transaction}
          onConfirmedClick={deleteTransaction}
          btnProps={{
            className: bs.btnOutlineDark,
          }}
        />
      </div>
    );
  }

  // transaction actions
  function createTransaction(): void {
    setTransactionToEdit(DEFAULT_TRANSACTION);
  }

  function editTransaction(transaction?: ITransaction): void {
    setTransactionToEdit(transaction);
  }

  function onEditCancel(): void {
    setTransactionToEdit(undefined);
  }

  function onEditComplete(transaction?: ITransaction): void {
    // always close the modal to reset it
    setTransactionToEdit(undefined);

    // should we re-open it?
    if (transaction?.id == DEFAULT_TRANSACTION.id) {
      editTransaction(getNextTransactionForContinuousCreation(transaction));
    }

    updateNonce();
  }

  async function deleteTransaction(transaction?: ITransaction): Promise<void> {
    if (!transaction) {
      return;
    }

    try {
      // await TransactionApi.deleteTransaction(transaction);
      updateNonce();
    } catch (error) {
      globalErrorManager.emitNonFatalError("Failed to delete transaction", error);
    }
  }

  return (
    <>
      {transactionToEdit ? (
        <TransactionEditModal
          transactionToEdit={transactionToEdit}
          onCancel={onEditCancel}
          onComplete={onEditComplete}
        />
      ) : null}

      <PageHeader>
        <h2>Transactions</h2>
        <PageHeaderActions>
          <KeyShortcut targetStr={"c"} onTrigger={createTransaction}>
            <IconBtn
              icon={"add"}
              text={"New Transaction"}
              onClick={createTransaction}
              btnProps={{
                className: combine(bs.btnSm, bs.btnSuccess),
              }}
            />
          </KeyShortcut>
        </PageHeaderActions>
      </PageHeader>

      <Card>
        <DataTable<ITransaction>
          columns={tableColumns}
          dataProvider={dataProvider}
          watchedProps={{ nonce }}
          rowRenderer={tableRowRenderer}
        />
      </Card>
    </>
  );
}

export { TransactionsPage };
