import React, { ReactElement } from "react";
import { subYears } from "date-fns";
import { useRouter } from "../app/router.js";
import { PageHeader } from "../page-header/page-header.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { DateRange, describeDateRange } from "../../utils/date-range.js";
import { DateRangePicker } from "../common/date-range/date-range-picker.js";
import { BalanceHistoryEntry } from "../../../api_gen/moneydashboard/v4/reporting_pb.js";
import { useAsyncEffect, useWaitGroup } from "../../utils/hooks.js";
import { reportingServiceClient } from "../../../api/api.js";
import { convertDateToProto } from "../../utils/dates.js";
import { toastBus } from "../toaster/toaster.js";
import { ErrorPanel } from "../common/error/error.js";
import { LoadingPanel } from "../common/loading/loading.js";

function BalanceHistoryPage(): ReactElement {
  const { setMeta } = useRouter();
  React.useEffect(() => {
    setMeta({ parents: ["Reports"], title: "Balance History" });
  }, []);

  const [dateRange, setDateRange] = React.useState<DateRange>({
    startDate: subYears(new Date(), 1),
    endDate: new Date(),
  });
  const [dateRangePickerOpen, setDateRangePickerOpen] = React.useState(false);

  const wg = useWaitGroup();
  const [error, setError] = React.useState<unknown>();
  const [data, setData] = React.useState<BalanceHistoryEntry[] | null>(null);

  useAsyncEffect(async () => {
    wg.add();
    try {
      const res = await reportingServiceClient.getBalanceHistory({
        startDate: convertDateToProto(dateRange.startDate),
        endDate: convertDateToProto(dateRange.endDate),
      });
      setData(res.entries);
    } catch (e) {
      toastBus.error("Failed to load balance history.");
      setError(e);
      console.log(e);
    }
    wg.done();
  }, [dateRange]);

  const buttons = [
    <button className={"outline"} onClick={() => setDateRangePickerOpen(true)}>
      <IconGroup>
        <Icon name={"calendar_month"} />
        <span>{describeDateRange(dateRange)}</span>
      </IconGroup>
    </button>,
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
        <PageHeader title={"Balance History"} icon={"monitoring"} buttons={buttons} />

        {body}

        {dateRangePickerOpen ? (
          <DateRangePicker
            dateRange={dateRange}
            onSave={(newDateRange: DateRange) => {
              setDateRange(newDateRange);
              setDateRangePickerOpen(false);
            }}
            onCancel={() => {
              setDateRangePickerOpen(false);
            }}
          />
        ) : null}
      </div>
    </>
  );
}

export { BalanceHistoryPage };
