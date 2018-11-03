import axios, { AxiosResponse } from "axios";
import { string } from "prop-types";
import { stringify } from "qs";
import { IColumnSortEntry, IDataTableDataProvider, IDataTableResponse } from "./DataTable";

class ApiDataTableDataProvider<Model> implements IDataTableDataProvider<Model> {

	private readonly api: string;
	private readonly apiParams: { readonly [key: string]: any };

	constructor(api: string, apiParams?: { readonly [key: string]: any }) {
		this.api = api;
		this.apiParams = apiParams;
	}

	public getData(
			start: number,
			length: number,
			searchTerm?: string,
			sortedColumns?: IColumnSortEntry[],
	): Promise<IDataTableResponse<Model>> {
		const arrayify = (val: string | string[]) => val instanceof string ? [val] : val;
		const order = (sortedColumns || []).map((sortEntry) => []
				.concat(arrayify(sortEntry.column.sortField))
				.concat(sortEntry.dir),
		);
		return axios
				.get(this.api, {
					params: {
						...this.apiParams,
						start,
						length,
						searchTerm: searchTerm || "",
						order,
					},
					paramsSerializer: (params) => stringify(params, { arrayFormat: "indices" }),
				})
				.then((res: AxiosResponse<IDataTableResponse<Model>>) => res.data);
	}
}

export {
	ApiDataTableDataProvider,
};
