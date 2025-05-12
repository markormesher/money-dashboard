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
import { convertDateToProto } from "../../utils/dates.js";
import { getTaxYear } from "../../utils/tax.js";
import { PLATFORM_MINIMUM_DATE } from "../../../config/consts.js";
import { formatCurrencyValue } from "../../utils/currency.js";

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
        <pre>{data.capitalDebugging.join("\n")}</pre>
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
              <span>
                Interest and dividend income only includes taxable sources; income in ISAs and pensions is not shown.
              </span>
            </IconGroup>
          </p>
        </section>
      </div>
    </>
  );
}

export { TaxHelperPage };
