import axios, { AxiosResponse } from "axios";
import { stringify } from "qs";
import { IDataTableResponse } from "../../../../../server/helpers/IDataTableResponse";
import { IColumnSortEntry } from "../DataTable";
import { IDataTableDataProvider } from "./IDataTableDataProvider";

interface IApiParams {
	readonly [key: string]: any;
}

class ApiDataTableDataProvider<Model> implements IDataTableDataProvider<Model> {

	private readonly api: string;
	private readonly apiParamProvider: () => IApiParams;

	constructor(api: string, apiParamProvider?: () => IApiParams) {
		this.api = api;
		this.apiParamProvider = apiParamProvider;
	}

	public getData(
			start: number,
			length: number,
			searchTerm?: string,
			sortedColumns?: IColumnSortEntry[],
	): Promise<IDataTableResponse<Model>> {
		const apiParams = this.apiParamProvider ? this.apiParamProvider() : {};
		return axios
				.get(this.api, {
					paramsSerializer: (params) => stringify(params, { arrayFormat: "indices" }),
					params: {
						...apiParams,
						start,
						length,
						searchTerm: searchTerm || "",
						order: this.formatOrdering(sortedColumns),
					},
				})
				.then((res: AxiosResponse<IDataTableResponse<Model>>) => res.data);
	}

	private formatOrdering(sortedColumns: IColumnSortEntry[]): string[][] {
		if (!sortedColumns) {
			return [];
		}
		return sortedColumns.map((sortEntry) => {
			const sortField = sortEntry.column.sortField;
			const output: string[] = [];
			if (typeof sortField === typeof "") {
				output.push(sortField as string);
			} else {
				(sortField as string[]).forEach((f) => output.push(f));
			}
			output.push(sortEntry.dir);
			return output;
		});
	}
}

export {
	ApiDataTableDataProvider,
};
