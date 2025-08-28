import React, { ReactElement } from "react";
import {
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { isNumber } from "chart.js/helpers";
import { useRouter } from "../app/router.js";
import { PageHeader } from "../page-header/page-header.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { DateRange, dateRangePresets, describeDateRange } from "../../utils/date-range.js";
import { DateRangePicker } from "../common/date-range/date-range-picker.js";
import { BalanceHistoryEntry } from "../../../api_gen/moneydashboard/v4/reporting_pb.js";
import { useAsyncEffect, useWaitGroup } from "../../utils/hooks.js";
import { reportingServiceClient } from "../../../api/api.js";
import { formatDateFromProto } from "../../utils/dates.js";
import { toastBus } from "../toaster/toaster.js";
import { ErrorPanel } from "../common/error/error.js";
import { LoadingPanel } from "../common/loading/loading.js";
import { formatCurrencyValue, formatCurrencyValueAsMagnitude } from "../../utils/currency.js";
import "./reports.css";
import { concatClasses } from "../../utils/style.js";

ChartJS.register(Tooltip, LinearScale, PointElement, LineElement, Filler);

function BalanceHistoryPage(): ReactElement {
  const { setMeta } = useRouter();
  React.useEffect(() => {
    setMeta({ parents: ["Reports"], title: "Balance History" });
  }, []);

  const [dateRange, setDateRange] = React.useState<DateRange>(dateRangePresets[0][1]);
  const [dateRangePickerOpen, setDateRangePickerOpen] = React.useState(false);

  const wg = useWaitGroup();
  const [error, setError] = React.useState<unknown>();
  const [data, setData] = React.useState<BalanceHistoryEntry[] | null>(null);

  useAsyncEffect(async () => {
    wg.add();
    setError(null);
    try {
      const res = await reportingServiceClient.getBalanceHistory({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      setData(res.entries);
    } catch (e) {
      toastBus.error("Failed to load balance history.");
      setError(e);
      console.log(e);
    }
    wg.done();
  }, [dateRange]);

  const options = [
    <button className={"outline"} onClick={() => setDateRangePickerOpen(true)} disabled={wg.count > 0}>
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
    const chartOptions: ChartOptions<"line"> = {
      responsive: true,
      animation: false,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "nearest",
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: (items) => {
              const idx = items[0]?.dataIndex;
              if (idx !== undefined && idx >= 0 && idx < data.length) {
                return formatDateFromProto(data[idx]?.date);
              } else {
                return "???";
              }
            },
            label: (ctx) => {
              return formatCurrencyValue(ctx.parsed.y, null);
            },
          },
        },
      },
      scales: {
        x: {
          type: "linear",
          bounds: "data",
          ticks: {
            callback: (val) => {
              if (isNumber(val)) {
                return formatDateFromProto(BigInt(val));
              } else {
                return "???";
              }
            },
          },
        },
        y: {
          type: "linear",
          beginAtZero: true,
          ticks: {
            callback: (val) => {
              if (isNumber(val)) {
                return formatCurrencyValueAsMagnitude(val);
              } else {
                return "???";
              }
            },
          },
        },
      },
    };

    const chartData: ChartData<"line"> = {
      labels: data.map((e) => Number(e.date)),
      datasets: [
        {
          data: data.map((e) => e.gbpBalance),
          fill: true,
          borderColor: "#018CD4", // pico azure 400
          backgroundColor: "#9BCCFD", // pico azure 200
          pointStyle: false,
        },
      ],
    };

    body = (
      <Line options={chartOptions} data={chartData} className={concatClasses("line", wg.count > 0 && "loading")} />
    );
  }

  return (
    <>
      <div id={"content"} className={"overflow-auto"}>
        <PageHeader title={"Balance History"} icon={"monitoring"} options={options} />

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
