import React, { ReactElement } from "react";
import { ArcElement, ChartData, Chart as ChartJS, ChartOptions, Filler, PointElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useRouter } from "../app/router.js";
import { PageHeader } from "../page-header/page-header.js";
import { useAsyncEffect } from "../../utils/hooks.js";
import { reportingServiceClient } from "../../../api/api.js";
import { toastBus } from "../toaster/toaster.js";
import { ErrorPanel } from "../common/error/error.js";
import { LoadingPanel } from "../common/loading/loading.js";
import "./reports.css";
import { HoldingBalance } from "../../../api_gen/moneydashboard/v4/reporting_pb.js";
import { formatCurrencyValue } from "../../utils/currency.js";
import { Icon, IconGroup } from "../common/icon/icon.js";

ChartJS.register(Tooltip, PointElement, Filler, ArcElement);

type UnitBalance = {
  isCash: boolean;
  name: string;
  notes: string;
  gbpBalance: number;
};

const seriesColours = [
  "#51B4FF", // azure
  "#FF9500", // pumpkin
  "#00C482", // jade
  "#DB90E8", // purple
  "#BBAC00", // yellow
  "#F983C7", // fuchsia
];

function PortfolioSummaryPage(): ReactElement {
  const { setMeta } = useRouter();
  React.useEffect(() => {
    setMeta({ parents: ["Reports"], title: "Portfolio Summary" });
  }, []);

  const [error, setError] = React.useState<unknown>();

  const [holdingBalances, setHoldingBalances] = React.useState<HoldingBalance[]>();
  useAsyncEffect(async () => {
    try {
      const res = await reportingServiceClient.getHoldingBalances({});
      setHoldingBalances(res.balances.filter((b) => b.gbpBalance != 0));
    } catch (e) {
      toastBus.error("Failed to load holding balances.");
      setError(e);
      console.log(e);
    }
  }, []);

  const [allBalances, setAllBalances] = React.useState<UnitBalance[]>([]);
  const [assetBalances, setAssetBalances] = React.useState<UnitBalance[]>([]);
  const [cashBalances, setCashBalances] = React.useState<UnitBalance[]>([]);
  React.useEffect(() => {
    const balances: Record<string, UnitBalance> = {};

    if (!holdingBalances) {
      setAllBalances([]);
      return;
    }

    for (const h of holdingBalances) {
      let id = "";
      if (h.holding?.asset) {
        id = h.holding.asset.id;
      } else if (h.holding?.currency) {
        id = h.holding.currency.id;
      } else {
        setAllBalances([]);
        setError(`No currency/asset ID found for holding ${h.holding?.id ?? "NO ID"}}`);
        return;
      }

      if (!balances[id]) {
        balances[id] = {
          isCash: !!h.holding.currency,
          name: h.holding.asset?.name ?? h.holding.currency?.code ?? "???",
          notes: h.holding.asset?.notes ?? "",
          gbpBalance: 0,
        };
      }

      const b = balances[id];
      if (b) {
        b.gbpBalance += h.gbpBalance;
      }
    }

    setAllBalances(Object.values(balances).sort((a, b) => b.gbpBalance - a.gbpBalance));

    setAssetBalances(
      Object.values(balances)
        .filter((b) => !b.isCash)
        .sort((a, b) => b.gbpBalance - a.gbpBalance),
    );

    setCashBalances(
      Object.values(balances)
        .filter((b) => b.isCash)
        .sort((a, b) => b.gbpBalance - a.gbpBalance),
    );
  }, [holdingBalances]);

  let body: ReactElement | null = null;
  if (error) {
    body = <ErrorPanel error={error} />;
  } else if (!allBalances.length) {
    body = <LoadingPanel />;
  } else {
    const totalBalance = allBalances.map((b) => b.gbpBalance).reduce((a, b) => a + b);
    const totalAssetBalance = assetBalances.map((b) => b.gbpBalance).reduce((a, b) => a + b);
    const totalCashBalance = cashBalances.map((b) => b.gbpBalance).reduce((a, b) => a + b);

    // assets vs cash

    const assetsVsCashChartBalances: UnitBalance[] = [
      { isCash: true, name: "Cash", notes: "", gbpBalance: totalCashBalance },
      { isCash: false, name: "Assets", notes: "", gbpBalance: totalAssetBalance },
    ];
    assetsVsCashChartBalances.sort((a, b) => b.gbpBalance - a.gbpBalance);

    const assetsVsCashChartOptions: ChartOptions<"doughnut"> = {
      responsive: true,
      animation: false,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            title: (items) => {
              const idx = items[0]?.dataIndex;
              if (idx !== undefined && idx >= 0 && idx < assetsVsCashChartBalances.length) {
                return assetsVsCashChartBalances[idx]?.name;
              } else {
                return "???";
              }
            },
            label: (ctx) => {
              return formatCurrencyValue(assetsVsCashChartBalances[ctx.datasetIndex]?.gbpBalance ?? 0, null);
            },
          },
        },
      },
    };

    const assetsVsCashChartData: ChartData<"doughnut"> = {
      datasets: [
        {
          data: assetsVsCashChartBalances.map((e) => e.gbpBalance),
          backgroundColor: seriesColours,
        },
      ],
    };

    // asset breakdown

    const assetDetailsChartOptions: ChartOptions<"doughnut"> = {
      responsive: true,
      animation: false,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            title: (items) => {
              const idx = items[0]?.dataIndex;
              if (idx !== undefined && idx >= 0 && idx < assetBalances.length) {
                return assetBalances[idx]?.name;
              } else {
                return "???";
              }
            },
            label: (ctx) => {
              return formatCurrencyValue(assetBalances[ctx.datasetIndex]?.gbpBalance ?? 0, null);
            },
          },
        },
      },
    };

    const assetDetailsChartData: ChartData<"doughnut"> = {
      datasets: [
        {
          data: assetBalances.map((e) => e.gbpBalance),
          backgroundColor: seriesColours,
        },
      ],
    };

    // output

    body = (
      <>
        <div className={"grid"}>
          <article>
            <header>
              <h4 className={"mb0"}>Cash vs. Assets</h4>
            </header>

            <Doughnut options={assetsVsCashChartOptions} data={assetsVsCashChartData} className={"pie"} />

            <table>
              {assetsVsCashChartBalances.map((b, i) => {
                return (
                  <tr>
                    <td>
                      <span style={{ color: seriesColours[i % seriesColours.length], marginRight: "0.5rem" }}>●</span>
                      {b.notes.length > 0 ? (
                        <IconGroup>
                          <span>{b.name}</span>
                          <span data-tooltip={b.notes}>
                            <Icon name={"info"} className={"muted"} />
                          </span>
                        </IconGroup>
                      ) : (
                        b.name
                      )}
                    </td>
                    <td className={"amount-cell"}>
                      <span className={"amount"}>{formatCurrencyValue(b.gbpBalance, null)}</span>
                    </td>
                    <td className={"amount-cell"}>
                      <span className={"amount"}>{Math.round((b.gbpBalance / totalBalance) * 100)}%</span>
                    </td>
                  </tr>
                );
              })}

              <tfoot>
                <tr>
                  <td></td>
                  <td className={"amount-cell"}>
                    <span className={"amount"}>{formatCurrencyValue(totalBalance, null)}</span>
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </article>

          <article>
            <header>
              <h4 className={"mb0"}>Asset Details</h4>
            </header>

            <Doughnut options={assetDetailsChartOptions} data={assetDetailsChartData} className={"pie"} />

            <table>
              {assetBalances.map((b, i) => {
                return (
                  <tr>
                    <td>
                      <span style={{ color: seriesColours[i % seriesColours.length], marginRight: "0.5rem" }}>●</span>
                      {b.notes.length > 0 ? (
                        <IconGroup>
                          <span>{b.name}</span>
                          <span data-tooltip={b.notes}>
                            <Icon name={"info"} className={"muted"} />
                          </span>
                        </IconGroup>
                      ) : (
                        b.name
                      )}
                    </td>
                    <td className={"amount-cell"}>
                      <span className={"amount"}>{formatCurrencyValue(b.gbpBalance, null)}</span>
                    </td>
                    <td className={"amount-cell"}>
                      <span className={"amount"}>{Math.round((b.gbpBalance / totalAssetBalance) * 100)}%</span>
                    </td>
                  </tr>
                );
              })}

              <tfoot>
                <tr>
                  <td></td>
                  <td className={"amount-cell"}>
                    <span className={"amount"}>{formatCurrencyValue(totalAssetBalance, null)}</span>
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </article>
        </div>
      </>
    );
  }

  return (
    <>
      <div id={"content"} className={"overflow-auto"}>
        <PageHeader title={"Portfolio Summary"} icon={"data_usage"} />

        {body}
      </div>
    </>
  );
}

export { PortfolioSummaryPage };
