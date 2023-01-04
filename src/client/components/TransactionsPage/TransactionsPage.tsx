import * as React from "react";
import { PureComponent, ReactElement, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { ITransaction, mapTransactionFromApi } from "../../../models/ITransaction";
import * as bs from "../../global-styles/Bootstrap.scss";
import { formatCurrencyStyled, formatDate } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { IRootState } from "../../redux/root";
import { setTransactionToEdit, startDeleteTransaction, TransactionCacheKeys } from "../../redux/transactions";
import { ApiDataTableDataProvider } from "../_ui/DataTable/DataProvider/ApiDataTableDataProvider";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import { InfoIcon } from "../_ui/InfoIcon/InfoIcon";
import { KeyShortcut } from "../_ui/KeyShortcut/KeyShortcut";
import { TransactionEditModal } from "../TransactionEditModal/TransactionEditModal";
import { PageHeader, PageHeaderActions } from "../_ui/PageHeader/PageHeader";
import { Card } from "../_ui/Card/Card";
import { DEFAULT_CURRENCY_CODE } from "../../../models/ICurrency";
import { Badge } from "../_ui/Badge/Badge";

interface ITransactionPageProps {
  readonly cacheTime: number;
  readonly transactionToEdit?: ITransaction;
  readonly actions?: {
    readonly deleteTransaction: (transaction: ITransaction) => AnyAction;
    readonly setTransactionToEdit: (transaction: ITransaction) => AnyAction;
  };
}

function mapStateToProps(state: IRootState, props: ITransactionPageProps): ITransactionPageProps {
  return {
    ...props,
    cacheTime: CacheKeyUtil.getKeyTime(TransactionCacheKeys.TRANSACTION_DATA),
    transactionToEdit: state.transactions.transactionToEdit,
  };
}

function mapDispatchToProps(dispatch: Dispatch, props: ITransactionPageProps): ITransactionPageProps {
  return {
    ...props,
    actions: {
      deleteTransaction: (transaction): AnyAction => dispatch(startDeleteTransaction(transaction)),
      setTransactionToEdit: (transaction): AnyAction => dispatch(setTransactionToEdit(transaction)),
    },
  };
}

class UCTransactionsPage extends PureComponent<ITransactionPageProps> {
  private tableColumns: IColumn[] = [
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

  private dataProvider = new ApiDataTableDataProvider<ITransaction>(
    "/api/transactions/table-data",
    () => ({
      cacheTime: this.props.cacheTime,
    }),
    mapTransactionFromApi,
  );

  constructor(props: ITransactionPageProps) {
    super(props);

    this.tableRowRenderer = this.tableRowRenderer.bind(this);
    this.generateActionButtons = this.generateActionButtons.bind(this);
    this.startTransactionCreation = this.startTransactionCreation.bind(this);
  }

  public render(): ReactNode {
    const { cacheTime, transactionToEdit } = this.props;

    return (
      <>
        {transactionToEdit !== undefined && <TransactionEditModal />}

        <PageHeader>
          <h2>Transactions</h2>
          <PageHeaderActions>
            <KeyShortcut targetStr={"c"} onTrigger={this.startTransactionCreation}>
              <IconBtn
                icon={"add"}
                text={"New Transaction"}
                onClick={this.startTransactionCreation}
                btnProps={{
                  className: combine(bs.btnSm, bs.btnSuccess),
                }}
              />
            </KeyShortcut>
          </PageHeaderActions>
        </PageHeader>

        <Card>
          <DataTable<ITransaction>
            columns={this.tableColumns}
            dataProvider={this.dataProvider}
            watchedProps={{ cacheTime }}
            rowRenderer={this.tableRowRenderer}
          />
        </Card>
      </>
    );
  }

  private tableRowRenderer(transaction: ITransaction): ReactElement<void> {
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
        <td>{this.generateActionButtons(transaction)}</td>
      </tr>
    );
  }

  private generateActionButtons(transaction: ITransaction): ReactElement<void> {
    return (
      <div className={combine(bs.btnGroup, bs.btnGroupSm)}>
        <IconBtn
          icon={"edit"}
          text={"Edit"}
          payload={transaction}
          onClick={this.props.actions.setTransactionToEdit}
          btnProps={{
            className: bs.btnOutlineDark,
            disabled: transaction.account.deleted || !transaction.account.active || transaction.category.deleted,
          }}
        />
        <DeleteBtn
          payload={transaction}
          onConfirmedClick={this.props.actions.deleteTransaction}
          btnProps={{
            className: bs.btnOutlineDark,
          }}
        />
      </div>
    );
  }

  private startTransactionCreation(): void {
    this.props.actions.setTransactionToEdit(null);
  }
}

export const TransactionsPage = connect(mapStateToProps, mapDispatchToProps)(UCTransactionsPage);
