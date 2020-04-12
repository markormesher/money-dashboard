import axios, { AxiosResponse } from "axios";
import * as React from "react";
import { Component, ReactNode } from "react";
import { subYears, startOfDay, endOfDay } from "date-fns";
import { IBalanceHistoryData } from "../../../commons/models/IBalanceHistoryData";
import { DateModeOption } from "../../../commons/models/ITransaction";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { formatCurrency, formatDate } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import * as styles from "../_commons/reports/Reports.scss";
import { DateModeToggleBtn } from "../_ui/DateModeToggleBtn/DateModeToggleBtn";
import { DateRangeChooser } from "../_ui/DateRangeChooser/DateRangeChooser";
import { RelativeChangeIcon } from "../_ui/RelativeChangeIcon/RelativeChangeIcon";
import { LineChart, ILineChartSeries, ILineChartProps } from "../_ui/LineChart/LineChart";

interface IBalanceHistoryReportState {
  readonly startDate: number;
  readonly endDate: number;
  readonly dateMode: DateModeOption;
  readonly data: IBalanceHistoryData;
  readonly loading: boolean;
  readonly failed: boolean;
}

class BalanceHistoryReport extends Component<{}, IBalanceHistoryReportState> {
  // give each remote request an increasing "frame" number so that late arrivals will be dropped
  private frameCounter = 0;
  private lastFrameReceived = 0;

  constructor(props: {}) {
    super(props);
    this.state = {
      startDate: startOfDay(subYears(new Date(), 1)).getTime(),
      endDate: endOfDay(new Date()).getTime(),
      dateMode: "transaction",
      data: undefined,
      loading: true,
      failed: false,
    };

    this.renderChart = this.renderChart.bind(this);
    this.renderInfoPanel = this.renderInfoPanel.bind(this);
    this.handleDateModeChange = this.handleDateModeChange.bind(this);
    this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
  }

  public componentDidMount(): void {
    this.fetchData();
  }

  public componentDidUpdate(_: {}, nextState: IBalanceHistoryReportState): void {
    if (
      this.state.startDate !== nextState.startDate ||
      this.state.endDate !== nextState.endDate ||
      this.state.dateMode !== nextState.dateMode
    ) {
      this.fetchData();
    }
  }

  public render(): ReactNode {
    const { startDate, endDate } = this.state;

    return (
      <>
        <div className={gs.headerWrapper}>
          <h1 className={bs.h2}>Balance History</h1>
          <div className={combine(bs.btnGroup, gs.headerExtras)}>
            <DateModeToggleBtn
              value={this.state.dateMode}
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
          </div>
        </div>

        <div className={bs.row}>
          <div className={combine(bs.col12, bs.mb3)}>{this.renderChart()}</div>
          <div className={combine(bs.col12, bs.colLg6, bs.mb3)}>{this.renderInfoPanel()}</div>
        </div>
      </>
    );
  }

  private renderChart(): ReactNode {
    const { loading, failed, data, startDate, endDate } = this.state;

    if (failed) {
      return <p>Chart failed to load. Please try again.</p>;
    }

    const balanceSeriesProps: Omit<ILineChartSeries, "dataPoints"> = {
      label: "Balance",
      strokeClass: styles.seriesStrokeBlue,
      fillClass: styles.seriesFillBlue,
      fillEnabled: true,
    };

    let series: ILineChartSeries[];

    if (data) {
      series = [
        {
          ...balanceSeriesProps,
          dataPoints: data.balanceDataPoints,
        },
      ];
    } else {
      series = [
        {
          ...balanceSeriesProps,
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
        valueRenderer: formatCurrency,
      },
      xAxisProperties: {
        valueRenderer: formatDate,
        forceAxisRangeToBeExact: true,
      },
    };

    return (
      <div className={combine(styles.chartContainer, loading && gs.loading)}>
        <LineChart {...chartProps} />
      </div>
    );
  }

  private renderInfoPanel(): ReactNode {
    const { loading, failed, data } = this.state;

    if (failed || !data) {
      return null;
    }

    const { minTotal, minDate, maxTotal, maxDate, changeAbsolute } = data;

    return (
      <div className={bs.card}>
        <div className={combine(bs.cardBody, gs.cardBody)}>
          <div className={combine(bs.row, loading && gs.loading)}>
            <div className={combine(bs.col6, bs.colMd4)}>
              <h6>Minimum:</h6>
              <p>
                {formatCurrency(minTotal)}
                <br />
                <span className={bs.textMuted}>{formatDate(minDate)}</span>
              </p>
            </div>
            <div className={combine(bs.col6, bs.colMd4)}>
              <h6>Maximum:</h6>
              <p>
                {formatCurrency(maxTotal)}
                <br />
                <span className={bs.textMuted}>{formatDate(maxDate)}</span>
              </p>
            </div>
            <div className={combine(bs.col6, bs.colMd4)}>
              <h6>Change:</h6>
              <p>
                <RelativeChangeIcon
                  change={changeAbsolute}
                  iconProps={{
                    className: bs.mr2,
                  }}
                />
                {formatCurrency(changeAbsolute)}
              </p>
            </div>
          </div>
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

  private fetchData(): void {
    const { startDate, endDate, dateMode } = this.state;

    this.setState({ loading: true });
    const frame = ++this.frameCounter;

    axios
      .get("/api/reports/balance-history/data", {
        params: {
          startDate: startDate,
          endDate: endDate,
          dateMode,
        },
      })
      .then((res: AxiosResponse<IBalanceHistoryData>) => res.data)
      .then((res) => this.onDataLoaded(frame, res))
      .catch(() => this.onDataLoadFailed(frame));
  }

  private onFrameReceived(frame: number): void {
    this.lastFrameReceived = Math.max(frame, this.lastFrameReceived);
  }

  private onDataLoaded(frame: number, data: IBalanceHistoryData): void {
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

export { BalanceHistoryReport };
