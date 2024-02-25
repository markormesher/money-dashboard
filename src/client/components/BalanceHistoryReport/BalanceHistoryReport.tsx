import axios from "axios";
import * as React from "react";
import { subYears, startOfDay, endOfDay } from "date-fns";
import { Chart } from "chart.js/auto";
import { IBalanceHistoryData } from "../../../models/IBalanceHistoryData";
import { DateModeOption } from "../../../models/ITransaction";
import bs from "../../global-styles/Bootstrap.scss";
import gs from "../../global-styles/Global.scss";
import { formatCurrencyForStat, formatDate } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import styles from "../_commons/reports/Reports.scss";
import { DateModeToggleBtn } from "../_ui/DateModeToggleBtn/DateModeToggleBtn";
import { DateRangeChooser } from "../_ui/DateRangeChooser/DateRangeChooser";
import { RelativeChangeIcon } from "../_ui/RelativeChangeIcon/RelativeChangeIcon";
import { Card } from "../_ui/Card/Card";
import { PageHeader } from "../_ui/PageHeader/PageHeader";
import { PageOptions } from "../_ui/PageOptions/PageOptions";
import { LoadingSpinner } from "../_ui/LoadingSpinner/LoadingSpinner";
import { globalErrorManager } from "../../helpers/errors/error-manager";
import { ChartCanvas } from "../charts/chart-canvas";

function BalanceHistoryReport(): React.ReactElement {
  const lastFrameRequested = React.useRef(0);
  const chart = React.useRef<Chart>(null);

  const [startDate, setStartDate] = React.useState(startOfDay(subYears(new Date(), 1)).getTime());
  const [endDate, setEndDate] = React.useState(endOfDay(new Date()).getTime());
  const [dateMode, setDateMode] = React.useState<DateModeOption>("transaction");
  const [data, setData] = React.useState<IBalanceHistoryData>();
  const [loading, setLoading] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    const thisFrame = ++lastFrameRequested.current;
    axios
      .get<IBalanceHistoryData>("/api/reports/balance-history/data", {
        params: {
          startDate,
          endDate,
          dateMode,
        },
      })
      .then((res) => {
        if (thisFrame < lastFrameRequested.current) {
          console.log(`Dropping result for frame ${thisFrame}`);
          return;
        }

        setData(res.data);
        setLoading(false);
        setFailed(false);

        if (chart.current) {
          chart.current.data = {
            labels: res.data.balanceDataPoints.map((d) => d.x),
            datasets: [
              {
                fill: "origin",
                borderWidth: 2,
                pointStyle: false,
                label: "Balance",
                data: res.data.balanceDataPoints.map((d) => d.y),
              },
            ],
          };
          chart.current.update();
        }
      })
      .catch((err) => {
        if (thisFrame < lastFrameRequested.current) {
          console.log(`Dropping result for frame ${thisFrame}`);
          return;
        }

        setData(undefined);
        setFailed(true);
        setLoading(false);
        globalErrorManager.emitNonFatalError("Failed to load chart data", err);
      });
  }, [startDate, endDate, dateMode]);

  // ui

  function renderOptions(): React.ReactElement {
    return (
      <PageOptions>
        <DateModeToggleBtn
          value={dateMode}
          onChange={setDateMode}
          btnProps={{
            className: combine(bs.btnOutlineInfo, bs.btnSm),
          }}
        />

        <DateRangeChooser
          startDate={startDate}
          endDate={endDate}
          onValueChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
          includeAllTimePreset={true}
          includeYearToDatePreset={true}
          includeFuturePresets={false}
          dropDownProps={{
            btnProps: {
              className: combine(bs.btnOutlineInfo, bs.btnSm),
            },
            placement: "left",
          }}
        />
      </PageOptions>
    );
  }

  function renderChart(): React.ReactElement {
    if (failed) {
      return <p>Chart failed to load. Please try again.</p>;
    }

    return (
      <div className={bs.row}>
        <div className={combine(bs.col12)}>
          <Card>
            <div className={combine(styles.chartContainer, bs.mb3, loading && gs.loading)}>
              <ChartCanvas chartRef={chart} />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  function renderStatCards(): React.ReactElement | null {
    if (failed || !data) {
      return null;
    }

    let minBalanceStat = <LoadingSpinner centre={true} />;
    let maxBalanceStat = <LoadingSpinner centre={true} />;
    let overallChangeStat = <LoadingSpinner centre={true} />;

    if (!loading) {
      const { minTotal, minTotalDate, maxTotal, maxTotalDate, changeAbsolute } = data;

      minBalanceStat = (
        <>
          <h6 className={gs.bigStatHeader}>Min Balance</h6>
          <p className={gs.bigStatValue}>{formatCurrencyForStat(minTotal)}</p>
          <p className={gs.bigStatContext}>on {formatDate(minTotalDate)}</p>
        </>
      );

      maxBalanceStat = (
        <>
          <h6 className={gs.bigStatHeader}>Max Balance</h6>
          <p className={gs.bigStatValue}>{formatCurrencyForStat(maxTotal)}</p>
          <p className={gs.bigStatContext}>on {formatDate(maxTotalDate)}</p>
        </>
      );

      overallChangeStat = (
        <>
          <h6 className={gs.bigStatHeader}>Overall Change</h6>
          <p className={gs.bigStatValue}>
            <RelativeChangeIcon
              change={changeAbsolute}
              iconProps={{
                className: bs.me2,
              }}
            />
            {formatCurrencyForStat(changeAbsolute)}
          </p>
        </>
      );
    }

    return (
      <div className={bs.row}>
        <div className={bs.col}>
          <Card>{minBalanceStat}</Card>
        </div>
        <div className={bs.col}>
          <Card>{maxBalanceStat}</Card>
        </div>
        <div className={bs.col}>
          <Card>{overallChangeStat}</Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader>
        <h2>Balance History</h2>
      </PageHeader>
      {renderOptions()}
      {renderChart()}
      {renderStatCards()}
    </>
  );
}

export { BalanceHistoryReport };
