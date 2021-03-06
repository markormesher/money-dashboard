import { faPencil, faPlus } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { PureComponent, ReactElement, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { IAccount, mapAccountFromApi } from "../../../commons/models/IAccount";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { generateAccountTypeBadge } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import {
  AccountCacheKeys,
  setAccountToEdit,
  setDisplayActiveOnly,
  startDeleteAccount,
  startSetAccountActive,
} from "../../redux/accounts";
import { IRootState } from "../../redux/root";
import { CheckboxBtn } from "../_ui/CheckboxBtn/CheckboxBtn";
import { ApiDataTableDataProvider } from "../_ui/DataTable/DataProvider/ApiDataTableDataProvider";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import { KeyShortcut } from "../_ui/KeyShortcut/KeyShortcut";
import { AccountEditModal } from "../AccountEditModal/AccountEditModal";
import { InfoIcon } from "../_ui/InfoIcon/InfoIcon";
import { PageHeader, PageHeaderActions } from "../_ui/PageHeader/PageHeader";
import { PageOptions } from "../_ui/PageOptions/PageOptions";
import { Card } from "../_ui/Card/Card";
import { IProfileAwareProps, mapStateToProfileAwareProps } from "../../redux/profiles";
import { DEFAULT_CURRENCY_CODE } from "../../../commons/models/ICurrency";
import { Badge } from "../_ui/Badge/Badge";

interface IAccountsPageProps extends IProfileAwareProps {
  readonly cacheTime: number;
  readonly displayActiveOnly?: boolean;
  readonly accountToEdit?: IAccount;
  readonly accountEditsInProgress?: IAccount[];

  readonly actions?: {
    readonly deleteAccount: (account: IAccount) => AnyAction;
    readonly setDisplayActiveOnly: (active: boolean) => AnyAction;
    readonly setAccountToEdit: (account: IAccount) => AnyAction;
    readonly setAccountActive: (active: boolean, account: IAccount) => AnyAction;
  };
}

function mapStateToProps(state: IRootState, props: IAccountsPageProps): IAccountsPageProps {
  return {
    ...mapStateToProfileAwareProps(state),
    ...props,
    cacheTime: CacheKeyUtil.getKeyTime(AccountCacheKeys.ACCOUNT_DATA),
    displayActiveOnly: state.accounts.displayActiveOnly,
    accountToEdit: state.accounts.accountToEdit,
    accountEditsInProgress: state.accounts.accountEditsInProgress,
  };
}

function mapDispatchToProps(dispatch: Dispatch, props: IAccountsPageProps): IAccountsPageProps {
  return {
    ...props,
    actions: {
      deleteAccount: (account): AnyAction => dispatch(startDeleteAccount(account)),
      setDisplayActiveOnly: (active): AnyAction => dispatch(setDisplayActiveOnly(active)),
      setAccountToEdit: (account): AnyAction => dispatch(setAccountToEdit(account)),
      setAccountActive: (active, account): AnyAction => dispatch(startSetAccountActive(account, active)),
    },
  };
}

class UCAccountsPage extends PureComponent<IAccountsPageProps> {
  private tableColumns: IColumn[] = [
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

  private dataProvider = new ApiDataTableDataProvider<IAccount>(
    "/api/accounts/table-data",
    () => ({
      cacheTime: this.props.cacheTime,
      activeOnly: this.props.displayActiveOnly,
    }),
    mapAccountFromApi,
  );

  constructor(props: IAccountsPageProps) {
    super(props);

    this.tableRowRenderer = this.tableRowRenderer.bind(this);
    this.generateActionButtons = this.generateActionButtons.bind(this);
    this.startAccountCreation = this.startAccountCreation.bind(this);
  }

  public render(): ReactNode {
    const { cacheTime, activeProfile, displayActiveOnly, accountToEdit } = this.props;

    return (
      <>
        {accountToEdit !== undefined && <AccountEditModal />}

        <PageHeader>
          <h2>Accounts</h2>
          <PageHeaderActions>
            <KeyShortcut targetStr={"c"} onTrigger={this.startAccountCreation}>
              <IconBtn
                icon={faPlus}
                text={"New Account"}
                onClick={this.startAccountCreation}
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
            checked={this.props.displayActiveOnly}
            onChange={this.props.actions.setDisplayActiveOnly}
            btnProps={{
              className: combine(bs.btnOutlineInfo, bs.btnSm),
            }}
          />
        </PageOptions>

        <Card>
          <DataTable<IAccount>
            columns={this.tableColumns}
            dataProvider={this.dataProvider}
            rowRenderer={this.tableRowRenderer}
            watchedProps={{ cacheTime, activeProfile, displayActiveOnly }}
          />
        </Card>
      </>
    );
  }

  private tableRowRenderer(account: IAccount): ReactElement<void> {
    return (
      <tr key={account.id}>
        <td>
          {account.name}
          {account.note && (
            <span className={bs.ml2}>
              <InfoIcon hoverText={account.note} />
            </span>
          )}
          {account.currencyCode !== DEFAULT_CURRENCY_CODE && (
            <Badge className={combine(bs.badgeDark, bs.ml2)}>{account.currencyCode}</Badge>
          )}
        </td>
        <td>{generateAccountTypeBadge(account)}</td>
        <td>{this.generateActionButtons(account)}</td>
      </tr>
    );
  }

  private generateActionButtons(account: IAccount): ReactElement<void> {
    const { actions, accountEditsInProgress } = this.props;
    return (
      <div className={combine(bs.btnGroup, bs.btnGroupSm)}>
        <IconBtn
          icon={faPencil}
          text={"Edit"}
          payload={account}
          onClick={actions.setAccountToEdit}
          btnProps={{
            className: combine(bs.btnOutlineDark, gs.btnMini),
            disabled: accountEditsInProgress.some((a) => a.id === account.id),
          }}
        />

        <CheckboxBtn
          text={"Active?"}
          payload={account}
          checked={account.active}
          onChange={actions.setAccountActive}
          btnProps={{
            className: combine(bs.btnOutlineDark, gs.btnMini),
            disabled: accountEditsInProgress.some((a) => a.id === account.id),
          }}
        />

        <DeleteBtn
          payload={account}
          onConfirmedClick={actions.deleteAccount}
          btnProps={{
            className: combine(bs.btnOutlineDark, gs.btnMini),
            disabled: accountEditsInProgress.some((a) => a.id === account.id),
          }}
        />
      </div>
    );
  }

  private startAccountCreation(): void {
    this.props.actions.setAccountToEdit(null);
  }
}

export const AccountsPage = connect(mapStateToProps, mapDispatchToProps)(UCAccountsPage);
