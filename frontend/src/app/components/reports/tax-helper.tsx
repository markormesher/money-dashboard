import React, { ReactElement } from "react";
import { useRouter } from "../app/router.js";
import { PageHeader } from "../page-header/page-header.js";
import { Icon } from "../common/icon/icon.js";
import { GetTaxReportResponse } from "../../../api_gen/moneydashboard/v4/reporting_pb.js";
import { useAsyncEffect, useWaitGroup } from "../../utils/hooks.js";
import { reportingServiceClient } from "../../../api/api.js";
import { toastBus } from "../toaster/toaster.js";
import { ErrorPanel } from "../common/error/error.js";
import { LoadingPanel } from "../common/loading/loading.js";
import "./reports.css";
import { convertDateToProto } from "../../utils/dates.js";
import { getTaxYear } from "../../utils/tax.js";
import { PLATFORM_MINIMUM_DATE } from "../../../config/consts.js";

function TaxHelperPage(): ReactElement {
  const { setMeta } = useRouter();
  React.useEffect(() => {
    setMeta({ parents: ["Reports"], title: "Tax Helper" });
  }, []);

  const today = convertDateToProto(new Date());
  const [taxYear, setTaxYear] = React.useState(getTaxYear(today));

  const wg = useWaitGroup();
  const [error, setError] = React.useState<unknown>();
  const [data, setData] = React.useState<GetTaxReportResponse>();

  useAsyncEffect(async () => {
    wg.add();
    setError(null);
    try {
      const res = await reportingServiceClient.getTaxReport({ taxYear: taxYear });
      setData(res);
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
    body = <pre>{JSON.stringify(data, null, 2)}</pre>;
  }

  return (
    <>
      <div id={"content"} className={"overflow-auto"}>
        <PageHeader title={"Tax Helper"} icon={"monitoring"} options={pageOptions} />
        {body}
      </div>
    </>
  );
}

export { TaxHelperPage };
