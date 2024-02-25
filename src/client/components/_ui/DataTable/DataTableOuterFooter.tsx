import * as React from "react";
import bs from "../../../global-styles/Bootstrap.scss";
import { ColumnSortEntry } from "./DataTable";
import styles from "./DataTable.scss";

type DataTableOuterFooterProps = {
  readonly pageSize: number;
  readonly currentPage: number;
  readonly filteredRowCount: number;
  readonly totalRowCount: number;
  readonly sortedColumns?: ColumnSortEntry[];
};

const sortDirectionFull = {
  ASC: "ascending",
  DESC: "descending",
};

function DataTableOuterFooter(props: DataTableOuterFooterProps): React.ReactElement {
  const { pageSize, currentPage, sortedColumns, filteredRowCount, totalRowCount } = props;

  const rowRangeFrom = Math.min(filteredRowCount, currentPage * pageSize + 1);
  const rowRangeTo = Math.min(filteredRowCount, (currentPage + 1) * pageSize);
  const showTotal = filteredRowCount !== totalRowCount;

  let sortingOrder = "Sorted by";
  if (sortedColumns) {
    sortedColumns.forEach((entry, i) => {
      if (!entry.dir) {
        return;
      }

      if (i === 0) {
        sortingOrder += " ";
      } else {
        sortingOrder += ", then ";
      }
      sortingOrder += entry.column.lowercaseTitle || entry.column.title.toLocaleLowerCase();
      sortingOrder += " " + sortDirectionFull[entry.dir];
    });
  }

  return (
    <div className={styles.tableFooter}>
      <p className={bs.floatEnd}>
        Showing rows {rowRangeFrom} to {rowRangeTo} of {filteredRowCount}
        {showTotal && <> (filtered from {totalRowCount} total)</>}
        {sortedColumns && sortedColumns.length > 0 && <> &bull; {sortingOrder}</>}
      </p>
    </div>
  );
}

export { DataTableOuterFooter };
