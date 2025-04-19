import React, { ReactElement } from "react";
import { subYears } from "date-fns";
import { useRouter } from "../app/router.js";
import { PageHeader } from "../page-header/page-header.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { DateRange, describeDateRange } from "../../utils/date-range.js";
import { DateRangePicker } from "../common/date-range/date-range-picker.js";

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

  const buttons = [
    <button className={"outline"} onClick={() => setDateRangePickerOpen(true)}>
      <IconGroup>
        <Icon name={"calendar_month"} />
        <span>{describeDateRange(dateRange)}</span>
      </IconGroup>
    </button>,
  ];

  return (
    <>
      <div id={"content"} className={"overflow-auto"}>
        <PageHeader title={"Balance History"} icon={"monitoring"} buttons={buttons} />

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
