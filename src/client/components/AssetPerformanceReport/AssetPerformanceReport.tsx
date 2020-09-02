import axios, { AxiosResponse } from "axios";
import * as React from "react";
import { Component, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { subYears, startOfDay, endOfDay } from "date-fns";
import { IAccount } from "../../../commons/models/IAccount";
import { IAssetPerformanceData } from "../../../commons/models/IAssetPerformanceData";
import { DateModeOption } from "../../../commons/models/ITransaction";
import { NULL_UUID } from "../../../commons/utils/entities";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { formatCurrency, formatPercent, formatDate, formatCurrencyForStat } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { startLoadAccountList } from "../../redux/accounts";
import { IRootState } from "../../redux/root";
import * as styles from "../_commons/reports/Reports.scss";
import { CheckboxBtn } from "../_ui/CheckboxBtn/CheckboxBtn";
import { ControlledRadioInput } from "../_ui/ControlledInputs/ControlledRadioInput";
import { DateModeToggleBtn } from "../_ui/DateModeToggleBtn/DateModeToggleBtn";
import { DateRangeChooser } from "../_ui/DateRangeChooser/DateRangeChooser";
import { LoadingSpinner } from "../_ui/LoadingSpinner/LoadingSpinner";
import { RelativeChangeIcon } from "../_ui/RelativeChangeIcon/RelativeChangeIcon";
import { LineChart, ILineChartSeries, ILineChartProps } from "../_ui/LineChart/LineChart";
import { Card } from "../_ui/Card/Card";
import { PageHeader } from "../_ui/PageHeader/PageHeader";
import { PageOptions } from "../_ui/PageOptions/PageOptions";

interface IAssetPerformanceReportProps {
  readonly accountList?: IAccount[];

  readonly actions?: {
    readonly startLoadAccountList: () => AnyAction;
  };
}

interface IAssetPerformanceReportState {
  readonly startDate: number;
  readonly endDate: number;
  readonly dateMode: DateModeOption;
  readonly zeroBasis: boolean;
  readonly showAsPercent: boolean;
  readonly accountId: string;
  readonly data: IAssetPerformanceData;
  readonly loading: boolean;
  readonly failed: boolean;
}

function mapStateToProps(state: IRootState, props: IAssetPerformanceReportProps): IAssetPerformanceReportProps {
  return {
    ...props,
    accountList: state.accounts.accountList,
  };
}

function mapDispatchToProps(dispatch: Dispatch, props: IAssetPerformanceReportProps): IAssetPerformanceReportProps {
  return {
    ...props,
    actions: {
      startLoadAccountList: (): AnyAction => dispatch(startLoadAccountList()),
    },
  };
}

class UCAssetPerformanceReport extends Component<IAssetPerformanceReportProps, IAssetPerformanceReportState> {
  // give each remote request an increasing "frame" number so that late arrivals will be dropped
  private frameCounter = 0;
  private lastFrameReceived = 0;

  constructor(props: IAssetPerformanceReportProps) {
    super(props);
    this.state = {
      startDate: startOfDay(subYears(new Date(), 1)).getTime(),
      endDate: endOfDay(new Date()).getTime(),
      dateMode: "transaction",
      zeroBasis: true,
      showAsPercent: false,
      accountId: NULL_UUID,
      data: undefined,
      loading: true,
      failed: false,
    };

    this.renderOptions = this.renderOptions.bind(this);
    this.renderChart = this.renderChart.bind(this);
    this.renderInfoPanels = this.renderInfoPanels.bind(this);
    this.renderChangeExclGrowthStatPanel = this.renderChangeExclGrowthStatPanel.bind(this);
    this.renderChangeInclGrowthStatPanel = this.renderChangeInclGrowthStatPanel.bind(this);
    this.renderNetGrowthStatPanel = this.renderNetGrowthStatPanel.bind(this);
    this.renderAccountChooser = this.renderAccountChooser.bind(this);
    this.renderAccountInputs = this.renderAccountInputs.bind(this);
    this.handleDateModeChange = this.handleDateModeChange.bind(this);
    this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
    this.handleAccountChange = this.handleAccountChange.bind(this);
    this.handleZeroBasisChange = this.handleZeroBasisChange.bind(this);
    this.handleShowAsPercentChange = this.handleShowAsPercentChange.bind(this);
  }

  public componentDidMount(): void {
    this.props.actions.startLoadAccountList();
    this.fetchData();
  }

  public componentDidUpdate(_: {}, nextState: IAssetPerformanceReportState): void {
    if (
      this.state.startDate !== nextState.startDate ||
      this.state.endDate !== nextState.endDate ||
      this.state.dateMode !== nextState.dateMode ||
      this.state.accountId !== nextState.accountId ||
      this.state.zeroBasis !== nextState.zeroBasis ||
      this.state.showAsPercent !== nextState.showAsPercent
    ) {
      this.fetchData();
    }
  }

  public render(): ReactNode {
    return (
      <>
        <PageHeader>Asset Performance</PageHeader>
        {this.renderOptions()}
        {this.renderAccountChooser()}
        {this.renderChart()}
        {this.renderInfoPanels()}
      </>
    );
  }

  private renderOptions(): ReactNode {
    const { startDate, endDate, dateMode, zeroBasis, showAsPercent } = this.state;

    return (
      <PageOptions>
        {zeroBasis && (
          <CheckboxBtn
            text={"Show as %"}
            checked={showAsPercent}
            onChange={this.handleShowAsPercentChange}
            btnProps={{
              className: combine(bs.btnOutlineInfo, bs.btnSm),
            }}
          />
        )}

        <CheckboxBtn
          text={"Zero Basis"}
          checked={zeroBasis}
          onChange={this.handleZeroBasisChange}
          btnProps={{
            className: combine(bs.btnOutlineInfo, bs.btnSm),
          }}
        />

        <DateModeToggleBtn
          value={dateMode}
          onChange={this.handleDateModeChange}
          btnProps={{
            className: combine(bs.btnOutlineInfo, bs.btnSm),
          }}
        />

        <DateRangeChooser
          startDate={startDate}
          endDate={endDate}
          onValueChange={this.handleDateRangeChange}
          includeAllTimePreset={true}
          includeYearToDatePreset={true}
          includeFuturePresets={false}
          setPosition={true}
          btnProps={{
            className: combine(bs.btnOutlineDark, bs.btnSm),
          }}
        />
      </PageOptions>
    );
  }

  private renderChart(): ReactNode {
    const { loading, failed, data, startDate, endDate } = this.state;

    if (failed) {
      return <p>Chart failed to load. Please try again.</p>;
    }

    const exclGrowthSeriesProps: Omit<ILineChartSeries, "dataPoints"> = {
      label: "Excluding Growth",
      strokeClass: styles.seriesStrokeBlue,
    };
    const inclGrowthSeriesProps: Omit<ILineChartSeries, "dataPoints"> = {
      label: "Including Growth",
      strokeClass: styles.seriesStrokeRed,
    };

    let series: ILineChartSeries[];

    if (data) {
      series = [
        {
          ...exclGrowthSeriesProps,
          dataPoints: data.dataExclGrowth,
        },
        {
          ...inclGrowthSeriesProps,
          dataPoints: data.dataInclGrowth,
        },
      ];
    } else {
      series = [
        {
          ...exclGrowthSeriesProps,
          dataPoints: [
            { x: startDate, y: 0 },
            { x: endDate, y: 0 },
          ],
        },
        {
          ...inclGrowthSeriesProps,
          dataPoints: [
            { x: startDate, y: 0 },
            { x: endDate, y: 0 },
          ],
        },
      ];
    }

    const chartProps: ILineChartProps = {
      series,
      yAxisProperties: {
        forcedValues: [0],
        valueRenderer: data?.zeroBasis && data?.showAsPercent ? (v): string => formatPercent(v * 100) : formatCurrency,
      },
      xAxisProperties: {
        valueRenderer: formatDate,
        forceAxisRangeToBeExact: true,
      },
    };

    return (
      <div className={bs.row}>
        <div className={combine(bs.col12)}>
          <Card>
            <div className={combine(styles.chartContainer, bs.mb3, loading && gs.loading)}>
              <LineChart {...chartProps} />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  private renderInfoPanels(): ReactNode {
    const { failed, data } = this.state;

    if (failed || !data) {
      return null;
    }

    return (
      <div className={bs.row}>
        <div className={bs.col}>
          <Card>{this.renderChangeExclGrowthStatPanel()}</Card>
        </div>
        <div className={bs.col}>
          <Card>{this.renderChangeInclGrowthStatPanel()}</Card>
        </div>
        <div className={bs.col}>
          <Card>{this.renderNetGrowthStatPanel()}</Card>
        </div>
      </div>
    );
  }

  private renderChangeExclGrowthStatPanel(): ReactNode {
    const { loading, failed, data } = this.state;

    if (failed || !data) {
      return null;
    }

    if (loading) {
      return <LoadingSpinner centre={true} />;
    }

    const { totalChangeExclGrowth } = data;

    return (
      <>
        <h6 className={gs.bigStatHeader}>Change Excl. Growth</h6>
        <p className={gs.bigStatValue}>{formatCurrencyForStat(totalChangeExclGrowth)}</p>
      </>
    );
  }

  private renderChangeInclGrowthStatPanel(): ReactNode {
    const { loading, failed, data } = this.state;

    if (failed || !data) {
      return null;
    }

    if (loading) {
      return <LoadingSpinner centre={true} />;
    }

    const { totalChangeInclGrowth } = data;

    return (
      <>
        <h6 className={gs.bigStatHeader}>Change Incl. Growth</h6>
        <p className={gs.bigStatValue}>{formatCurrencyForStat(totalChangeInclGrowth)}</p>
      </>
    );
  }

  private renderNetGrowthStatPanel(): ReactNode {
    const { loading, failed, data } = this.state;

    if (failed || !data) {
      return null;
    }

    if (loading) {
      return <LoadingSpinner centre={true} />;
    }

    const { totalChangeExclGrowth, totalChangeInclGrowth } = data;
    const netGrowth = totalChangeInclGrowth - totalChangeExclGrowth;

    return (
      <>
        <h6 className={gs.bigStatHeader}>Net Growth</h6>
        <p className={gs.bigStatValue}>
          <RelativeChangeIcon
            change={netGrowth}
            iconProps={{
              className: bs.mr2,
            }}
          />
          {formatCurrencyForStat(netGrowth)}
        </p>
      </>
    );
  }

  private renderAccountChooser(): ReactNode {
    // TODO: make each account a toggle on/off
    const { accountList } = this.props;
    return (
      <div className={bs.row}>
        <div className={bs.col}>
          <Card>
            {!accountList && <LoadingSpinner centre={true} />}
            {accountList && this.renderAccountInputs()}
          </Card>
        </div>
      </div>
    );
  }

  private renderAccountInputs(): ReactNode {
    const { accountList } = this.props;
    const { accountId } = this.state;
    const accounts = accountList.filter((ac) => ac.type === "asset").sort((a, b) => a.name.localeCompare(b.name));

    if (accounts.length === 0) {
      return <p>{"You don't have any asset-type accounts."}</p>;
    }

    return (
      <form>
        <div className={bs.row}>
          <div key={`account-chooser-all`} className={combine(bs.col12, bs.colMd6, bs.colLg3, bs.mb3)}>
            <ControlledRadioInput
              name={"account"}
              id={NULL_UUID}
              value={NULL_UUID}
              label={<em>All Accounts</em>}
              checked={accountId === NULL_UUID}
              onValueChange={this.handleAccountChange}
            />
          </div>
          {accounts.map((ac) => (
            <div key={`account-chooser-${ac.id}`} className={combine(bs.col12, bs.colMd6, bs.colLg3, bs.mb3)}>
              <ControlledRadioInput
                name={"account"}
                id={ac.id}
                value={ac.id}
                label={ac.name}
                checked={accountId === ac.id}
                onValueChange={this.handleAccountChange}
              />
            </div>
          ))}
        </div>
      </form>
    );
  }

  private handleDateModeChange(dateMode: DateModeOption): void {
    this.setState({ dateMode });
  }

  private handleDateRangeChange(startDate: number, endDate: number): void {
    this.setState({ startDate, endDate });
  }

  private handleAccountChange(accountId: string): void {
    this.setState({ accountId });
  }

  private handleZeroBasisChange(zeroBasis: boolean): void {
    this.setState({ zeroBasis });
  }

  private handleShowAsPercentChange(showAsPercent: boolean): void {
    this.setState({ showAsPercent });
  }

  private fetchData(): void {
    const { startDate, endDate, dateMode, accountId, zeroBasis, showAsPercent } = this.state;

    if (!accountId) {
      return;
    }

    this.setState({ loading: true });
    const frame = ++this.frameCounter;

    axios
      .get("/api/reports/asset-performance/data", {
        params: {
          startDate: startDate,
          endDate: endDate,
          dateMode,
          accountId,
          zeroBasis,
          showAsPercent,
        },
      })
      .then((res: AxiosResponse<IAssetPerformanceData>) => res.data)
      .then((res) => this.onDataLoaded(frame, res))
      .catch(() => this.onDataLoadFailed(frame));
  }

  private onFrameReceived(frame: number): void {
    this.lastFrameReceived = Math.max(frame, this.lastFrameReceived);
  }

  private onDataLoaded(frame: number, data: IAssetPerformanceData): void {
    if (frame <= this.lastFrameReceived) {
      return;
    }

    this.onFrameReceived(frame);

    this.setState({
      loading: false,
      failed: false,
      data,
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

export const AssetPerformanceReport = connect(mapStateToProps, mapDispatchToProps)(UCAssetPerformanceReport);
