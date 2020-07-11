import axios, { AxiosResponse } from "axios";
import * as React from "react";
import { Component, ReactNode } from "react";
import { IDetailedCategoryBalance } from "../../../commons/models/IDetailedCategoryBalance";
import { ITaxYearDepositsData, mapTaxYearDepositsDataFromApi } from "../../../commons/models/ITaxYearDepositsData";
import { DateModeOption } from "../../../commons/models/ITransaction";
import { AccountTag } from "../../../commons/models/IAccount";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { formatCurrencyStyled } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { CheckboxBtn } from "../_ui/CheckboxBtn/CheckboxBtn";
import { DateModeToggleBtn } from "../_ui/DateModeToggleBtn/DateModeToggleBtn";
import { LoadingSpinner } from "../_ui/LoadingSpinner/LoadingSpinner";

interface IPensionDepositsReportState {
  readonly dateMode: DateModeOption;
  readonly splitValues: boolean;
  readonly data: ITaxYearDepositsData;
  readonly loading: boolean;
  readonly failed: boolean;
}

class PensionDepositsReport extends Component<{}, IPensionDepositsReportState> {
  // give each remote request an increasing "frame" number so that late arrivals will be dropped
  private frameCounter = 0;
  private lastFrameReceived = 0;

  constructor(props: {}) {
    super(props);
    this.state = {
      dateMode: "transaction",
      splitValues: false,
      data: undefined,
      loading: true,
      failed: false,
    };

    this.renderResults = this.renderResults.bind(this);
    this.renderCategoryBalance = this.renderCategoryBalance.bind(this);
    this.handleSplitValueChange = this.handleSplitValueChange.bind(this);
    this.handleDateModeChange = this.handleDateModeChange.bind(this);
  }

  public componentDidMount(): void {
    this.fetchData();
  }

  public componentDidUpdate(nextProps: {}, nextState: IPensionDepositsReportState): void {
    if (this.state.dateMode !== nextState.dateMode) {
      this.fetchData();
    }
  }

  public render(): ReactNode {
    return (
      <>
        <div className={gs.headerWrapper}>
          <h1 className={bs.h2}>Pension Deposits</h1>
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
              <strong>Total (excl. Asset Growth)</strong>
            </td>
            {years.map((year) => (
              <td key={year} className={bs.textRight}>
                {formatCurrencyStyled(
                  Object.values(data.yearData[year])
                    .filter((b) => !b.category.isAssetGrowthCategory)
                    .map((b) => b.balanceIn + b.balanceOut)
                    .reduce((a, b) => a + b, 0),
                )}
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
              <strong>Total (incl. Asset Growth)</strong>
            </td>
            {years.map((year) => (
              <td key={year} className={bs.textRight}>
                {formatCurrencyStyled(
                  Object.values(data.yearData[year])
                    .map((b) => b.balanceIn + b.balanceOut)
                    .reduce((a, b) => a + b, 0),
                )}
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

  private handleSplitValueChange(splitValues: boolean): void {
    this.setState({ splitValues });
  }

  private handleDateModeChange(dateMode: DateModeOption): void {
    this.setState({ dateMode });
  }

  private fetchData(): void {
    const { dateMode } = this.state;

    this.setState({ loading: true });
    const frame = ++this.frameCounter;

    axios
      .get("/api/reports/tax-year-deposits/data", {
        params: { dateMode, tag: "pension" as AccountTag },
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

export { PensionDepositsReport };
