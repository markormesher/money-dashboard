import * as React from "react";
import bs from "../../../global-styles/Bootstrap.scss";
import { combine } from "../../../helpers/style-helpers";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import { globalErrorManager } from "../../../helpers/errors/error-manager";
import { IDataTableDataProvider } from "./DataProvider/IDataTableDataProvider";
import styles from "./DataTable.scss";
import { DataTableInnerHeader } from "./DataTableInnerHeader";
import { DataTableOuterFooter } from "./DataTableOuterFooter";
import { DataTableOuterHeader } from "./DataTableOuterHeader";

type SortDirection = "ASC" | "DESC";

type Column = {
  readonly title: string;
  readonly lowercaseTitle?: string;
  readonly sortable?: boolean;
  readonly sortField?: string;
  readonly defaultSortDirection?: SortDirection;
  readonly defaultSortPriority?: number;
};

type ColumnSortEntry = {
  readonly column: Column;
  readonly dir?: SortDirection;
};

type DataTableProps<Model> = {
  readonly dataProvider: IDataTableDataProvider<Model>;
  readonly watchedProps?: unknown;
  readonly pageSize?: number;
  readonly columns: Column[];
  readonly rowRenderer: (row: Model, index: number) => React.ReactNode | React.ReactElement;
};

function DataTable<Model>(props: DataTableProps<Model>): React.ReactElement {
  const { watchedProps, columns, rowRenderer, dataProvider, pageSize: rawPageSize } = props;
  const pageSize = rawPageSize ?? 15;

  const lastFrameRequested = React.useRef(0);

  const [loading, setLoading] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortedColumns, setSortedColumns] = React.useState<ColumnSortEntry[]>([]);
  const [rows, setRows] = React.useState<Model[]>();
  const [filteredRowCount, setFilteredRowCount] = React.useState(0);
  const [totalRowCount, setTotalRowCount] = React.useState(0);

  // data fetching
  React.useEffect(() => {
    fetchData();
  }, [watchedProps, currentPage, searchTerm, sortedColumns]);

  function fetchData(): void {
    const thisFrame = ++lastFrameRequested.current;
    setLoading(true);

    dataProvider
      .getData(currentPage * pageSize, pageSize, searchTerm, sortedColumns)
      .then((data) => {
        if (thisFrame < lastFrameRequested.current) {
          console.log(`Dropping data table result for frame ${thisFrame}`);
          return;
        }

        const maxPossiblePage = data.filteredRowCount === 0 ? 0 : Math.ceil(data.filteredRowCount / pageSize) - 1;
        setLoading(false);
        setFailed(false);
        setCurrentPage(Math.min(currentPage, maxPossiblePage));
        setRows(data.data);
        setFilteredRowCount(data.filteredRowCount);
        setTotalRowCount(data.totalRowCount);
      })
      .catch((err) => {
        if (thisFrame < lastFrameRequested.current) {
          console.log(`Dropping data table result for frame ${thisFrame}`);
          return;
        }

        globalErrorManager.emitNonFatalError("Failed to load table data", err);
        setLoading(false);
        setFailed(true);
        setCurrentPage(0);
        setRows([]);
        setFilteredRowCount(0);
        setTotalRowCount(0);
      });
  }

  // ui
  function generateMsgRow(msg: string): React.ReactElement<void> {
    return (
      <tr>
        <td colSpan={columns.length} className={combine(bs.textCenter, bs.textMuted)}>
          {msg}
        </td>
      </tr>
    );
  }

  return (
    <div className={combine(styles.tableWrapper, loading && styles.loading)}>
      <DataTableOuterHeader
        loading={loading}
        currentPage={currentPage}
        pageSize={pageSize}
        rowCount={filteredRowCount}
        onPageChange={setCurrentPage}
        onSearchTermChange={setSearchTerm}
      />

      <div className={styles.tableBodyWrapper}>
        <div className={styles.loadingIconWrapper}>{loading && <LoadingSpinner />}</div>

        <div className={bs.tableResponsive}>
          <table className={combine(bs.table, styles.table, bs.tableStriped, bs.tableSm)}>
            <DataTableInnerHeader
              columns={columns}
              sortedColumns={sortedColumns}
              onSortOrderUpdate={setSortedColumns}
            />

            <tbody>
              {!failed && (!rows || rows.length === 0) && generateMsgRow("No rows to display")}
              {failed && generateMsgRow("Failed to load data")}
              {rows ? rows.map(rowRenderer) : null}
            </tbody>
          </table>
        </div>
      </div>

      <DataTableOuterFooter
        currentPage={currentPage}
        pageSize={pageSize}
        filteredRowCount={filteredRowCount}
        totalRowCount={totalRowCount}
        sortedColumns={sortedColumns}
      />
    </div>
  );
}

export { Column, ColumnSortEntry, SortDirection, DataTable };
