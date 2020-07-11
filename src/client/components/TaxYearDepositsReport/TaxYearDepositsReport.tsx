import axios, { AxiosResponse } from "axios";
import * as React from "react";
import { Component, ReactNode } from "react";
import { faPiggyBank } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IDetailedCategoryBalance } from "../../../commons/models/IDetailedCategoryBalance";
import { ITaxYearDepositsData, mapTaxYearDepositsDataFromApi } from "../../../commons/models/ITaxYearDepositsData";
import { DateModeOption } from "../../../commons/models/ITransaction";
import { AccountTag, ACCOUNT_TAG_DISPLAY_NAMES } from "../../../commons/models/IAccount";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { formatCurrencyStyled } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { CheckboxBtn } from "../_ui/CheckboxBtn/CheckboxBtn";
import { DateModeToggleBtn } from "../_ui/DateModeToggleBtn/DateModeToggleBtn";
import { LoadingSpinner } from "../_ui/LoadingSpinner/LoadingSpinner";
import { ControlledRadioInput } from "../_ui/ControlledInputs/ControlledRadioInput";

interface ITaxYearDepositsReportState {
  readonly dateMode: DateModeOption;
  readonly splitValues: boolean;
  readonly accountTag: AccountTag;
  readonly data: ITaxYearDepositsData;
  readonly loading: boolean;
  readonly failed: boolean;
}

class TaxYearDepositsReport extends Component<{}, ITaxYearDepositsReportState> {
  // give each remote request an increasing "frame" number so that late arrivals will be dropped
  private frameCounter = 0;
  private lastFrameReceived = 0;

  constructor(props: {}) {
    super(props);
    this.state = {
      dateMode: "transaction",
      splitValues: false,
      accountTag: "pension",
      data: undefined,
      loading: true,
      failed: false,
    };

    this.renderResults = this.renderResults.bind(this);
    this.renderCategoryBalance = this.renderCategoryBalance.bind(this);
    this.renderAccountTagChooser = this.renderAccountTagChooser.bind(this);
    this.handleDateModeChange = this.handleDateModeChange.bind(this);
    this.handleSplitValueChange = this.handleSplitValueChange.bind(this);
    this.handleAccountTagChange = this.handleAccountTagChange.bind(this);
  }

  public componentDidMount(): void {
    this.fetchData();
  }

  public componentDidUpdate(nextProps: {}, nextState: ITaxYearDepositsReportState): void {
    if (this.state.dateMode !== nextState.dateMode || this.state.accountTag !== nextState.accountTag) {
      this.fetchData();
    }
  }

  public render(): ReactNode {
    return (
      <>
        <div className={gs.headerWrapper}>
          <h1 className={bs.h2}>Tax Year Deposits</h1>
          <div className={combine(bs.btnGroup, gs.headerExtras)}>
            <CheckboxBtn
              text={"Split Values"}
              checked={this.state.splitValues}
              onChange={this.handleSplitValueChange}
              btnProps={{
                className: combine(bs.btnOutlineInfo, bs.btnSm),
              }}
            />

            <DateModeToggleBtn
              value={this.state.dateMode}
              onChange={this.handleDateModeChange}
              btnProps={{
                className: combine(bs.btnOutlineInfo, bs.btnSm),
              }}
            />
          </div>
        </div>

        <div className={bs.row}>
          <div className={combine(bs.col12, bs.colLg6, bs.mb3)}>{this.renderAccountTagChooser()}</div>
          <div className={bs.col12}>{this.renderResults()}</div>
        </div>
      </>
    );
  }

  private renderResults(): ReactNode {
    const { loading, failed, data } = this.state;

    if (failed) {
      return <p>Data failed to load. Please try again.</p>;
    }

    if (loading) {
      return <LoadingSpinner centre={true} />;
    }

    if (!data) {
      return <p>No data to display.</p>;
    }

    const nonAssetCategories = data.allCategories
      .filter((c) => !c.isAssetGrowthCategory)
      .sort((a, b) => a.name.localeCompare(b.name));
    const assetCategories = data.allCategories
      .filter((c) => c.isAssetGrowthCategory)
      .sort((a, b) => a.name.localeCompare(b.name));
    const years = data.allYears.sort((a, b) => a - b);

    return (
      <table className={combine(bs.table, bs.tableStriped, bs.tableSm)}>
        <thead>
          <tr>
            <td>{/* blank top-left corner cell */}</td>
            {years.map((year) => (
              <th key={year} className={bs.textRight}>
                {year}/{year + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {nonAssetCategories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              {years.map((year) => (
                <td key={year} className={bs.textRight}>
                  {this.renderCategoryBalance(data.yearData[year][category.id])}
                </td>
              ))}
            </tr>
          ))}

          <tr className={gs.bottomBorder}>
            <td>
              <strong>Total Deposits</strong>
            </td>
            {years.map((year) => (
              <td key={year} className={bs.textRight}>
                <strong>
                  {formatCurrencyStyled(
                    Object.values(data.yearData[year])
                      .filter((b) => !b.category.isAssetGrowthCategory)
                      .map((b) => b.balanceIn + b.balanceOut)
                      .reduce((a, b) => a + b, 0),
                  )}
                </strong>
              </td>
            ))}
          </tr>

          {assetCategories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              {years.map((year) => (
                <td key={year} className={bs.textRight}>
                  {this.renderCategoryBalance(data.yearData[year][category.id])}
                </td>
              ))}
            </tr>
          ))}

          <tr className={gs.bottomBorder}>
            <td>
              <strong>Total</strong>
            </td>
            {years.map((year) => (
              <td key={year} className={bs.textRight}>
                <strong>
                  {formatCurrencyStyled(
                    Object.values(data.yearData[year])
                      .map((b) => b.balanceIn + b.balanceOut)
                      .reduce((a, b) => a + b, 0),
                  )}
                </strong>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  }

  private renderCategoryBalance(balance: IDetailedCategoryBalance): ReactNode {
    if (!balance) {
      return null;
    }

    if (this.state.splitValues) {
      return (
        <>
          {formatCurrencyStyled(balance.balanceIn)}
          <br />
          {formatCurrencyStyled(balance.balanceOut)}
        </>
      );
    } else {
      return <>{formatCurrencyStyled(balance.balanceIn + balance.balanceOut)}</>;
    }
  }

  private renderAccountTagChooser(): ReactNode {
    const { accountTag } = this.state;

    const validTags: AccountTag[] = ["pension", "isa"];
    const tags = Object.entries(ACCOUNT_TAG_DISPLAY_NAMES)
      .filter(([key]) => validTags.includes(key as AccountTag))
      .sort((a, b) => a[1].localeCompare(b[1]));

    return (
      <div className={bs.card}>
        <h5 className={combine(bs.cardHeader, bs.h5)}>
          <FontAwesomeIcon icon={faPiggyBank} className={bs.mr3} />
          Select Account Tag
        </h5>
        <div className={combine(bs.cardBody, gs.cardBody)}>
          <form>
            <div className={bs.row}>
              {tags.map(([tagKey, tagName]) => (
                <div key={`account-tag-chooser-${tagKey}`} className={combine(bs.col12, bs.colMd6, bs.mb3)}>
                  <ControlledRadioInput
                    name={"account"}
                    id={tagKey}
                    value={tagKey}
                    label={tagName}
                    checked={accountTag === tagKey}
                    onValueChange={this.handleAccountTagChange}
                  />
                </div>
              ))}
            </div>
          </form>
        </div>
      </div>
    );
  }

  private handleDateModeChange(dateMode: DateModeOption): void {
    this.setState({ dateMode });
  }

  private handleSplitValueChange(splitValues: boolean): void {
    this.setState({ splitValues });
  }

  private handleAccountTagChange(accountTag: string): void {
    this.setState({ accountTag: accountTag as AccountTag });
  }

  private fetchData(): void {
    const { dateMode, accountTag } = this.state;

    this.setState({ loading: true });
    const frame = ++this.frameCounter;

    axios
      .get("/api/reports/tax-year-deposits/data", {
        params: { dateMode, accountTag },
      })
      .then((res: AxiosResponse<ITaxYearDepositsData>) => mapTaxYearDepositsDataFromApi(res.data))
      .then((res) => this.onDataLoaded(frame, res))
      .catch(() => this.onDataLoadFailed(frame));
  }

  private onFrameReceived(frame: number): void {
    this.lastFrameReceived = Math.max(frame, this.lastFrameReceived);
  }

  private onDataLoaded(frame: number, rawData: ITaxYearDepositsData): void {
    if (frame <= this.lastFrameReceived) {
      return;
    }

    this.onFrameReceived(frame);

    this.setState({
      loading: false,
      failed: false,
      data: rawData,
    });
  }

  private onDataLoadFailed(frame: number): void {
    if (frame <= this.lastFrameReceived) {
      return;
    }

    this.onFrameReceived(frame);

    this.setState({
      loading: false,
      failed: true,
      data: undefined,
    });
  }
}

export { TaxYearDepositsReport };
