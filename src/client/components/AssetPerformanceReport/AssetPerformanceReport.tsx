import axios from "axios";
import * as React from "react";
import { subYears, startOfDay, endOfDay } from "date-fns";
import { Chart } from "chart.js/auto";
import { IAssetPerformanceData } from "../../../models/IAssetPerformanceData";
import { DateModeOption } from "../../../models/ITransaction";
import bs from "../../global-styles/Bootstrap.scss";
import gs from "../../global-styles/Global.scss";
import { formatCurrency, formatCurrencyForStat, formatPercent } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import styles from "../_commons/reports/Reports.scss";
import { CheckboxBtn } from "../_ui/CheckboxBtn/CheckboxBtn";
import { DateModeToggleBtn } from "../_ui/DateModeToggleBtn/DateModeToggleBtn";
import { DateRangeChooser } from "../_ui/DateRangeChooser/DateRangeChooser";
import { LoadingSpinner } from "../_ui/LoadingSpinner/LoadingSpinner";
import { RelativeChangeIcon } from "../_ui/RelativeChangeIcon/RelativeChangeIcon";
import { Card } from "../_ui/Card/Card";
import { AccountApi } from "../../api/accounts";
import { PageHeader } from "../_ui/PageHeader/PageHeader";
import { PageOptions } from "../_ui/PageOptions/PageOptions";
import { globalErrorManager } from "../../helpers/errors/error-manager";
import { ChartCanvas } from "../charts/chart-canvas";

function AssetPerformanceReport(): React.ReactElement {
  const lastFrameRequested = React.useRef(0);
  const chart = React.useRef<Chart>(null);

  const [startDate, setStartDate] = React.useState(startOfDay(subYears(new Date(), 1)).getTime());
  const [endDate, setEndDate] = React.useState(endOfDay(new Date()).getTime());
  const [dateMode, setDateMode] = React.useState<DateModeOption>("transaction");
  const [zeroBasis, setZeroBasis] = React.useState(true);
  const [showAsPercent, setShowAsPercent] = React.useState(false);
  const [selectedAccounts, setSelectedAccounts] = React.useState<string[]>([]);
  const [data, setData] = React.useState<IAssetPerformanceData>();
  const [loading, setLoading] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  const [accountList, refreshAccountList] = AccountApi.useAccountList();
  React.useEffect(() => {
    refreshAccountList();
  }, []);

  React.useEffect(() => {
    if (!selectedAccounts) {
      return;
    }

    setLoading(true);
    const thisFrame = ++lastFrameRequested.current;

    axios
      .get<IAssetPerformanceData>("/api/reports/asset-performance/data", {
        params: {
          startDate,
          endDate,
          dateMode,
          selectedAccounts,
          zeroBasis,
          showAsPercent,
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
            labels: res.data.dataInclGrowth.map((d) => d.x),
            datasets: [
              {
                borderWidth: 2,
                pointStyle: false,
                label: "Including Growth",
                data: res.data.dataInclGrowth.map((d) => d.y),
              },
              {
                borderWidth: 2,
                pointStyle: false,
                label: "Excluding Growth",
                data: res.data.dataExclGrowth.map((d) => d.y),
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

        setFailed(true);
        setLoading(false);
        globalErrorManager.emitNonFatalError("Failed to load chart data", err);
      });
  }, [startDate, endDate, dateMode, selectedAccounts, zeroBasis, showAsPercent]);

  function handleAccountChange(checked: boolean, id?: string): void {
    if (!id) {
      return;
    }

    if (checked) {
      setSelectedAccounts([...selectedAccounts, id]);
    } else {
      setSelectedAccounts(selectedAccounts.filter((i) => i != id));
    }
  }

  function renderOptions(): React.ReactElement {
    return (
      <PageOptions>
        {zeroBasis && (
          <CheckboxBtn
            text={"Show as %"}
            checked={showAsPercent}
            onChange={(checked) => setShowAsPercent(checked)}
            btnProps={{
              className: combine(bs.btnOutlineInfo, bs.btnSm),
            }}
          />
        )}

        <CheckboxBtn
          text={"Zero Basis"}
          checked={zeroBasis}
          onChange={(checked) => setZeroBasis(checked)}
          btnProps={{
            className: combine(bs.btnOutlineInfo, bs.btnSm),
          }}
        />

        <DateModeToggleBtn
          value={dateMode}
          onChange={(mode) => setDateMode(mode)}
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

        {renderAccountOptions()}
      </PageOptions>
    );
  }

  function renderAccountOptions(): React.ReactElement {
    if (accountList == undefined) {
      return <LoadingSpinner />;
    }

    const assetAccounts = accountList.filter((ac) => ac.type === "asset").sort((a, b) => a.name.localeCompare(b.name));
    if (assetAccounts.length === 0) {
      return (
        <>
          <hr />
          <p>{"You don't have any asset-type accounts."}</p>
        </>
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
            onChange={handleAccountChange}
            btnProps={{
              className: combine(bs.btnOutlineInfo, bs.btnSm),
            }}
          />
        ))}
      </>
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
              <ChartCanvas
                chartRef={chart}
                initConfig={{
                  options: {
                    scales: {
                      y: {
                        ticks: {
                          callback: (v) =>
                            zeroBasis && showAsPercent
                              ? formatPercent(parseFloat("" + v) * 100)
                              : formatCurrency(parseFloat("" + v)),
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: true,
                      },
                      tooltip: {
                        callbacks: {
                          label: (ctx) => {
                            return (
                              " " +
                              (zeroBasis && showAsPercent
                                ? formatPercent(ctx.parsed.y * 100)
                                : formatCurrency(ctx.parsed.y))
                            );
                          },
                        },
                      },
                    },
                  },
                }}
              />
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

    let changeExclGrowthStat = <LoadingSpinner centre={true} />;
    let changeInclGrowthStat = <LoadingSpinner centre={true} />;
    let netGrowthStat = <LoadingSpinner centre={true} />;

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
                className: bs.me2,
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

  return (
    <>
      <PageHeader>
        <h2>Asset Performance</h2>
      </PageHeader>
      {renderOptions()}
      {renderChart()}
      {renderStatCards()}
    </>
  );
}

export { AssetPerformanceReport };
