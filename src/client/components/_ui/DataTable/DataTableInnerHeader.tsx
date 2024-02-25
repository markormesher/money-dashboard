import * as React from "react";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { combine } from "../../../helpers/style-helpers";
import { MaterialIcon } from "../MaterialIcon/MaterialIcon";
import { Column, ColumnSortEntry, SortDirection } from "./DataTable";
import * as styles from "./DataTable.scss";

type DataTableInnerHeaderProps = {
  readonly columns: Column[];
  readonly sortedColumns?: ColumnSortEntry[];
  readonly onSortOrderUpdate?: (sortedColumns: ColumnSortEntry[]) => void;
};

function getNextSortDirection(dir?: SortDirection): SortDirection | undefined {
  switch (dir) {
    case "ASC":
      return "DESC";

    case "DESC":
      return undefined;

    default:
      return "ASC";
  }
}

function DataTableInnerHeader(props: DataTableInnerHeaderProps): React.ReactElement {
  const { columns, sortedColumns, onSortOrderUpdate } = props;

  React.useEffect(() => {
    if (sortedColumns === undefined) {
      onSortOrderUpdate?.(generateDefaultSortedColumns());
    }
  }, []);

  function generateDefaultSortedColumns(): ColumnSortEntry[] {
    return columns
      .filter((col) => col.defaultSortDirection !== undefined)
      .sort((a, b) => (a.defaultSortPriority || 0) - (b.defaultSortPriority || 0))
      .map((col) => ({ column: col, dir: col.defaultSortDirection }));
  }

  function toggleColumnSortOrder(column: Column): void {
    // note: always compare columns by key not equality
    const oldSortedColumns = props.sortedColumns ?? [];
    const sortedColumns = oldSortedColumns.slice(0); // work on a copy
    const currentSortEntryIndex = sortedColumns.findIndex((sc) => sc.column.title === column.title);

    if (currentSortEntryIndex < 0) {
      // add at the beginning
      sortedColumns.unshift({ column, dir: getNextSortDirection(undefined) });
    } else {
      const nextDir = getNextSortDirection(sortedColumns[currentSortEntryIndex].dir);
      // remove...
      sortedColumns.splice(currentSortEntryIndex, 1);
      if (nextDir !== undefined) {
        // ...and re-add at the beginning
        sortedColumns.unshift({ column, dir: nextDir });
      }
    }

    onSortOrderUpdate?.(sortedColumns);
  }

  const headers = columns.map((col) => {
    const sortable = col.sortable !== false; // undefined implicitly means yes
    const sortEntry = (sortedColumns ?? []).find((sc) => sc.column.title === col.title);
    const sorted = sortEntry !== undefined;

    const sortIcon = sorted ? (sortEntry.dir === "ASC" ? "arrow_downward" : "arrow_upward") : "swap_vert";
    const sortIconClasses = combine(bs.me1, !sorted && styles.sortInactive);

    const clickHandler = sortable ? (): void => toggleColumnSortOrder(col) : undefined;
    const className = sortable ? styles.sortable : undefined;

    return (
      <th key={col.title} className={className} onClick={clickHandler}>
        {sortable && <MaterialIcon icon={sortIcon} className={sortIconClasses} />}
        {col.title}
      </th>
    );
  });

  return (
    <thead>
      <tr>{headers}</tr>
    </thead>
  );
}

export { DataTableInnerHeader };
