import axios from "axios";
import * as React from "react";
import { subYears, startOfDay, endOfDay } from "date-fns";
import { IAssetPerformanceData } from "../../../models/IAssetPerformanceData";
import { DateModeOption } from "../../../models/ITransaction";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { formatCurrency, formatPercent, formatDate, formatCurrencyForStat } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import * as styles from "../_commons/reports/Reports.scss";
import { CheckboxBtn } from "../_ui/CheckboxBtn/CheckboxBtn";
import { DateModeToggleBtn } from "../_ui/DateModeToggleBtn/DateModeToggleBtn";
import { DateRangeChooser } from "../_ui/DateRangeChooser/DateRangeChooser";
import { LoadingSpinner } from "../_ui/LoadingSpinner/LoadingSpinner";
import { RelativeChangeIcon } from "../_ui/RelativeChangeIcon/RelativeChangeIcon";
import { LineChart, ILineChartSeries, ILineChartProps } from "../_ui/LineChart/LineChart";
import { Card } from "../_ui/Card/Card";
import { AccountApi } from "../../api/accounts";
import { PageHeader } from "../_ui/PageHeader/PageHeader";
import { PageOptions } from "../_ui/PageOptions/PageOptions";
import { globalErrorManager } from "../../helpers/errors/error-manager";

function AssetPerformanceReport(): React.ReactElement {
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
        setData(res.data);
        setLoading(false);
        setFailed(false);
      })
      .catch((err) => {
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
