import { IColumnSortEntry } from "../DataTable";

interface IDataTableDataProvider<Model> {
	readonly getData: (
			start: number,
			length: number,
			searchTerm?: string,
			sortedColumns?: IColumnSortEntry[],
	) => Promise<IDataTableResponse<Model>>;
}

// TODO: don't duplicate this interface in client/server folders
interface IDataTableResponse<Model> {
	readonly filteredRowCount: number;
	readonly totalRowCount: number;
	readonly data: Model[];
}

export {
	IDataTableDataProvider,
	IDataTableResponse,
};
