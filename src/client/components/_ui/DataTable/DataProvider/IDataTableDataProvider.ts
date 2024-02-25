import { IDataTableResponse } from "../../../../../models/IDataTableResponse";
import { ColumnSortEntry } from "../DataTable";

interface IDataTableDataProvider<Model> {
  readonly getData: (
    start: number,
    length: number,
    searchTerm?: string,
    sortedColumns?: ColumnSortEntry[],
  ) => Promise<IDataTableResponse<Model>>;
}

export { IDataTableDataProvider };
