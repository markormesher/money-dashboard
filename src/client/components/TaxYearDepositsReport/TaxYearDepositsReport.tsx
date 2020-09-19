import axios, { AxiosResponse } from "axios";
import * as React from "react";
import { Component, ReactNode } from "react";
import { connect } from "react-redux";
import { faCircle, faCheckCircle } from "@fortawesome/pro-light-svg-icons";
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
import { Card } from "../_ui/Card/Card";
import { PageHeader } from "../_ui/PageHeader/PageHeader";
import { PageOptions } from "../_ui/PageOptions/PageOptions";
import { IProfileAwareProps, mapStateToProfileAwareProps } from "../../redux/profiles";
import { IRootState } from "../../redux/root";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ITaxYearDepositsReportProps extends IProfileAwareProps {}

interface ITaxYearDepositsReportState {
  readonly dateMode: DateModeOption;
  readonly splitValues: boolean;
  readonly accountTag: AccountTag;
  readonly data: ITaxYearDepositsData;
  readonly loading: boolean;
  readonly failed: boolean;
}

function mapStateToProps(state: IRootState, props?: ITaxYearDepositsReportProps): ITaxYearDepositsReportProps {
  return {
    ...mapStateToProfileAwareProps(state),
    ...props,
  };
}

class UCTaxYearDepositsReport extends Component<ITaxYearDepositsReportProps, ITaxYearDepositsReportState> {
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

    this.renderAccountTagChooser = this.renderAccountTagChooser.bind(this);
    this.renderResults = this.renderResults.bind(this);
    this.renderCategoryBalance = this.renderCategoryBalance.bind(this);
    this.handleDateModeChange = this.handleDateModeChange.bind(this);
    this.handleSplitValueChange = this.handleSplitValueChange.bind(this);
    this.handleAccountTagChange = this.handleAccountTagChange.bind(this);
  }

  public componentDidMount(): void {
    this.fetchData();
  }

  public componentDidUpdate(nextProps: ITaxYearDepositsReportProps, nextState: ITaxYearDepositsReportState): void {
    if (
      this.state.dateMode !== nextState.dateMode ||
      this.state.accountTag !== nextState.accountTag ||
      this.props.activeProfile !== nextProps.activeProfile
    ) {
      this.fetchData();
    }
  }

  public render(): ReactNode {
    return (
      <>
        <PageHeader>
          <h2>Tax Year Deposits</h2>
        </PageHeader>

        <PageOptions>
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

          <hr />

          {this.renderAccountTagChooser()}
        </PageOptions>

        <Card>{this.renderResults()}</Card>
      </>
    );
  }

  private renderAccountTagChooser(): ReactNode {
    const { accountTag } = this.state;

    // tags that are relevant for tax year summaries
    const validTags: AccountTag[] = ["pension", "isa"];
    const tags = Object.entries(ACCOUNT_TAG_DISPLAY_NAMES)
      .filter(([key]) => validTags.includes(key as AccountTag))
      .sort((a, b) => a[1].localeCompare(b[1]));

    return tags.map(([tagKey, tagName]) => (
      <CheckboxBtn
        key={`account-tag-${tagKey}`}
        payload={tagKey}
        text={tagName}
        checked={accountTag === tagKey}
        onChange={this.handleAccountTagChange}
        btnProps={{
          className: combine(bs.btnOutlineInfo, bs.btnSm),
        }}
        iconUnchecked={faCircle}
        iconChecked={faCheckCircle}
      />
    ));
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
      <div className={bs.tableResponsive}>
        <table className={combine(bs.table, bs.tableStriped, bs.tableSm)}>
          <thead>
            <tr>
              <th>{/* blank top-left corner cell */}</th>
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
      </div>
    );
  }

  private renderCategoryBalance(balance: IDetailedCategoryBalance): ReactNode {
    if (!balance) {
      return null;
    }

    const inc = balance.balanceIn;
    const dec = balance.balanceOut;

    if (this.state.splitValues) {
      return (
        <>
          {inc === 0 ? <>&nbsp;</> : formatCurrencyStyled(inc)}
          <br />
          {dec === 0 ? <>&nbsp;</> : formatCurrencyStyled(dec)}
        </>
      );
    } else {
      return <>{formatCurrencyStyled(inc + dec)}</>;
    }
  }

  private handleDateModeChange(dateMode: DateModeOption): void {
    this.setState({ dateMode });
  }

  private handleSplitValueChange(splitValues: boolean): void {
    this.setState({ splitValues });
  }

  private handleAccountTagChange(checked: boolean, accountTag: string): void {
    if (checked) {
      this.setState({ accountTag: accountTag as AccountTag });
    }
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

export const TaxYearDepositsReport = connect(mapStateToProps)(UCTaxYearDepositsReport);
