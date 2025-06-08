import React, { ReactElement } from "react";
import { useRouter } from "../app/router.js";
import { PageHeader } from "../page-header/page-header.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { TaxReport } from "../../../api_gen/moneydashboard/v4/reporting_pb.js";
import { useAsyncEffect, useWaitGroup } from "../../utils/hooks.js";
import { reportingServiceClient } from "../../../api/api.js";
import { toastBus } from "../toaster/toaster.js";
import { ErrorPanel } from "../common/error/error.js";
import { LoadingPanel } from "../common/loading/loading.js";
import "./reports.css";
import { convertDateToProto, formatDateFromProto } from "../../utils/dates.js";
import { getTaxYear } from "../../utils/tax.js";
import { PLATFORM_MINIMUM_DATE } from "../../../config/consts.js";
import { formatCurrencyValue } from "../../utils/currency.js";
import { formatAssetQuantity } from "../../utils/assets.js";

function TaxHelperPage(): ReactElement {
  const { setMeta } = useRouter();
  React.useEffect(() => {
    setMeta({ parents: ["Reports"], title: "Tax Helper" });
  }, []);

  const today = convertDateToProto(new Date());
  const [taxYear, setTaxYear] = React.useState(getTaxYear(today));

  const wg = useWaitGroup();
  const [error, setError] = React.useState<unknown>();
  const [data, setData] = React.useState<TaxReport>();

  useAsyncEffect(async () => {
    wg.add();
    setError(null);
    try {
      const res = await reportingServiceClient.getTaxReport({ taxYear: taxYear });
      setData(res.taxReport);
    } catch (e) {
      toastBus.error("Failed to load report data.");
      setError(e);
      console.log(e);
    }
    wg.done();
  }, [taxYear]);

  const pageOptions = [
    <fieldset role={"group"}>
      <button
        className={"outline"}
        onClick={() => setTaxYear((curr) => Math.max(1, curr - 1))}
        disabled={taxYear <= PLATFORM_MINIMUM_DATE.getFullYear()}
      >
        <Icon name={"arrow_back"} />
      </button>
      <button className={"outline"}>
        <span className={"muted"}>
          {taxYear} - {taxYear + 1}
        </span>
      </button>
      <button className={"outline"} onClick={() => setTaxYear((curr) => curr + 1)}>
        <Icon name={"arrow_forward"} />
      </button>
    </fieldset>,
  ];

  let body: ReactElement | null = null;
  if (error) {
    body = <ErrorPanel error={error} />;
  } else if (!data) {
    body = <LoadingPanel />;
  } else {
    body = (
      <>
        <h4>Interest Income</h4>
        {data.interestIncome.length > 0 ? (
          <table className={"striped"}>
            <thead>
              <tr>
                <td>Account</td>
                <td>Holding</td>
                <td>Amount</td>
              </tr>
            </thead>
            <tbody>
              {data.interestIncome
                .sort((a, b) => a.holding?.account?.name?.localeCompare(b.holding?.account?.name ?? "") ?? 0)
                .map((b) => {
                  return (
                    <tr>
                      <td>{b.holding?.account?.name}</td>
                      <td>{b.holding?.name}</td>
                      <td className={"amount-cell"}>
                        <span className={"amount"}>{formatCurrencyValue(b.gbpBalance, null)}</span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td></td>
                <td className={"amount-cell"}>
                  <span className={"amount"}>
                    <strong>
                      {formatCurrencyValue(
                        data.interestIncome.map((b) => b.gbpBalance).reduce((a, b) => a + b, 0),
                        null,
                      )}
                    </strong>
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <p>
            <em>None.</em>
          </p>
        )}

        <h4>Dividend Income</h4>
        {data.dividendIncome.length > 0 ? (
          <table className={"striped"}>
            <thead>
              <tr>
                <td>Account</td>
                <td>Holding</td>
                <td>Amount</td>
              </tr>
            </thead>
            <tbody>
              {data.dividendIncome
                .sort((a, b) => a.holding?.account?.name?.localeCompare(b.holding?.account?.name ?? "") ?? 0)
                .map((b) => {
                  return (
                    <tr>
                      <td>{b.holding?.account?.name}</td>
                      <td>{b.holding?.name}</td>
                      <td className={"amount-cell"}>
                        <span className={"amount"}>{formatCurrencyValue(b.gbpBalance, null)}</span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td></td>
                <td className={"amount-cell"}>
                  <span className={"amount"}>
                    <strong>
                      {formatCurrencyValue(
                        data.dividendIncome.map((b) => b.gbpBalance).reduce((a, b) => a + b, 0),
                        null,
                      )}
                    </strong>
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <p>
            <em>None.</em>
          </p>
        )}

        <h4>Capital Events</h4>
        {data.capitalEvents.length > 0 ? (
          data.capitalEvents.map((e, i, a) => {
            const proceeds = -1 * e.qty * e.avgGbpUnitPrice;
            const costs = e.matches.map((m) => m.qty * m.price).reduce((a, b) => a + b);
            const totalMatches = e.matches.map((m) => m.qty).reduce((a, b) => a + b);
            const avgMatchPrice = costs / totalMatches;

            return (
              <>
                <details>
                  <summary>
                    <IconGroup>
                      <Icon
                        name={e.type == "disposal" ? "upload" : "download"}
                        className={e.type == "disposal" ? "tax-disposal-icon" : "tax-acquisition-icon"}
                      />
                      <span>
                        {formatDateFromProto(e.date)}
                        <span className={"separator"}>&#x2022;</span>
                        {e.holding?.name ?? "Unknown Holding"}
                        <span className={"separator"}>&#x2022;</span>
                        {e.type == "disposal" ? "Disposal" : "Acquisition"} of {formatAssetQuantity(Math.abs(e.qty))}{" "}
                        unit{e.qty == 1 ? "" : "s"} @ {formatCurrencyValue(e.avgGbpUnitPrice, null)}
                      </span>
                    </IconGroup>
                  </summary>

                  <div className={"grid"}>
                    {e.type == "disposal" ? (
                      <div>
                        <table className={"auto-width"}>
                          <thead>
                            <tr>
                              <td colSpan={999} style={{ textAlign: "center" }}>
                                P/L Summary
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Proceeds</td>
                              <td className={"amount-cell"}>
                                <span className={"amount"}>{formatCurrencyValue(proceeds, null)}</span>
                              </td>
                            </tr>
                            <tr>
                              <td>Costs</td>
                              <td className={"amount-cell"}>
                                <span className={"amount"}>{formatCurrencyValue(costs, null)}</span>
                              </td>
                            </tr>
                            <tr>
                              <td>P/L</td>
                              <td className={"amount-cell"}>
                                <span className={"amount"}>{formatCurrencyValue(proceeds - costs, null)}</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : null}

                    <div>
                      <table className={"auto-width"}>
                        <thead>
                          <tr>
                            <td colSpan={999} style={{ textAlign: "center" }}>
                              Event Matches
                            </td>
                          </tr>
                          <tr>
                            <th>{e.type == "disposal" ? "Acquisition" : "Disposal"} Date</th>
                            <th>Rule</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {e.matches.map((m) => {
                            return (
                              <tr>
                                <td>{m.date == BigInt(0) ? "n/a" : formatDateFromProto(m.date)}</td>
                                <td>{m.note}</td>
                                <td className={"amount-cell"}>
                                  <span className={"amount"}>{formatAssetQuantity(m.qty)}</span>
                                </td>
                                <td className={"amount-cell"}>
                                  <span className={"amount"}>{formatCurrencyValue(m.price, null)}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td></td>
                            <td></td>
                            <td className={"amount-cell"}>
                              <span className={"amount"}>{formatAssetQuantity(totalMatches)}</span>
                            </td>
                            <td className={"amount-cell"}>
                              <span className={"amount"}>{formatCurrencyValue(avgMatchPrice, null)}</span>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </details>

                {i < a.length - 1 ? <hr /> : null}
              </>
            );
          })
        ) : (
          <p>
            <em>None.</em>
          </p>
        )}
      </>
    );
  }

  return (
    <>
      <div id={"content"} className={"overflow-auto"}>
        <PageHeader title={"Tax Helper"} icon={"monitoring"} options={pageOptions} />
        {body}
        <hr />
        <section>
          <p>
            <IconGroup>
              <Icon name={"info"} className={"muted"} />
              <span>This report only includes taxable sources; ISAs and pensions are not shown.</span>
            </IconGroup>
          </p>
        </section>
      </div>
    </>
  );
}

export { TaxHelperPage };
