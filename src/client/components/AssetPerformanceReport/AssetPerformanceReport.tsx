import axios, { AxiosResponse } from "axios";
import * as React from "react";
import { Component, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { subYears, startOfDay, endOfDay } from "date-fns";
import { IAccount } from "../../../commons/models/IAccount";
import { IAssetPerformanceData } from "../../../commons/models/IAssetPerformanceData";
import { DateModeOption } from "../../../commons/models/ITransaction";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { formatCurrency, formatPercent, formatDate, formatCurrencyForStat } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { startLoadAccountList } from "../../redux/accounts";
import { IRootState } from "../../redux/root";
import * as styles from "../_commons/reports/Reports.scss";
import { CheckboxBtn } from "../_ui/CheckboxBtn/CheckboxBtn";
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
  readonly selectedAccounts: string[];
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
      selectedAccounts: [],
      data: undefined,
      loading: true,
      failed: false,
    };

    this.renderOptions = this.renderOptions.bind(this);
    this.renderAccountOptions = this.renderAccountOptions.bind(this);
    this.renderChart = this.renderChart.bind(this);
    this.renderStatCards = this.renderStatCards.bind(this);
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
      this.state.selectedAccounts !== nextState.selectedAccounts ||
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
        {this.renderChart()}
        {this.renderStatCards()}
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
            className: combine(bs.btnOutlineInfo, bs.btnSm),
          }}
        />

        {this.renderAccountOptions()}
      </PageOptions>
    );
  }

  private renderAccountOptions(): ReactNode {
    const { accountList } = this.props;

    if (!accountList) {
      return <LoadingSpinner />;
    }

    const { selectedAccounts } = this.state;
    const assetAccounts = accountList.filter((ac) => ac.type === "asset").sort((a, b) => a.name.localeCompare(b.name));

    if (assetAccounts.length === 0) {
      return (
        <p>{"You don't have any asset-type accounts."}</p>
      );
    }

    return (
      <>
        <hr />
        {assetAccounts.map((ac) => (
          <CheckboxBtn
            key={`account-chooser-${ac.id}`}
            text={ac.name}
            payload={ac.id}
            checked={selectedAccounts.includes(ac.id)}
            onChange={this.handleAccountChange}
            btnProps={{
              className: combine(bs.btnOutlineInfo, bs.btnSm),
            }}
          />
        ))}
      </>
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

  private renderStatCards(): ReactNode {
    const { loading, failed, data } = this.state;

    if (failed || !data) {
      return null;
    }

    let changeExclGrowthStat: ReactNode = <LoadingSpinner centre={true} />;
    let changeInclGrowthStat: ReactNode = <LoadingSpinner centre={true} />;
    let netGrowthStat: ReactNode = <LoadingSpinner centre={true} />;

    if (!loading) {
      const { totalChangeExclGrowth, totalChangeInclGrowth } = data;
      const netGrowth = totalChangeInclGrowth - totalChangeExclGrowth;

      changeExclGrowthStat = (
        <>
          <h6 className={gs.bigStatHeader}>Change Excl. Growth</h6>
          <p className={gs.bigStatValue}>{formatCurrencyForStat(totalChangeExclGrowth)}</p>
        </>
      );

      changeInclGrowthStat = (
        <>
          <h6 className={gs.bigStatHeader}>Change Incl. Growth</h6>
          <p className={gs.bigStatValue}>{formatCurrencyForStat(totalChangeInclGrowth)}</p>
        </>
      );

      netGrowthStat = (
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

    return (
      <div className={bs.row}>
        <div className={bs.col}>
          <Card>{changeExclGrowthStat}</Card>
        </div>
        <div className={bs.col}>
          <Card>{changeInclGrowthStat}</Card>
        </div>
        <div className={bs.col}>
          <Card>{netGrowthStat}</Card>
        </div>
      </div>
    );
  }

  private handleDateModeChange(dateMode: DateModeOption): void {
    this.setState({ dateMode });
  }

  private handleDateRangeChange(startDate: number, endDate: number): void {
    this.setState({ startDate, endDate });
  }

  private handleAccountChange(checked: boolean, accountId: string): void {
    const oldList = this.state.selectedAccounts;
    if (checked) {
      this.setState({ selectedAccounts: [...oldList, accountId] });
    } else {
      this.setState({ selectedAccounts: oldList.filter((a) => a !== accountId) });
    }
  }

  private handleZeroBasisChange(zeroBasis: boolean): void {
    this.setState({ zeroBasis });
  }

  private handleShowAsPercentChange(showAsPercent: boolean): void {
    this.setState({ showAsPercent });
  }

  private fetchData(): void {
    const { startDate, endDate, dateMode, selectedAccounts, zeroBasis, showAsPercent } = this.state;

    if (!selectedAccounts) {
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
          selectedAccounts,
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
