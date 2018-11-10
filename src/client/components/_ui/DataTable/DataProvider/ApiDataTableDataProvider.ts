import axios, { AxiosResponse } from "axios";
import { stringify } from "qs";
import { IColumnSortEntry } from "../DataTable";
import { IDataTableDataProvider, IDataTableResponse } from "./IDataTableDataProvider";

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
		// TODO: make sortField an array to get rid of this nonsense
		const wrapSingleValuesInArray = (val: string | string[]) => (typeof val === typeof "" ? [val] : val) as string[];
		const order = (sortedColumns || []).map((sortEntry) => {
			const output: string[] = wrapSingleValuesInArray(sortEntry.column.sortField);
			output.push(sortEntry.dir);
			return output;
		});
		return axios
				.get(this.api, {
					paramsSerializer: (params) => stringify(params, { arrayFormat: "indices" }),
					params: {
						...apiParams,
						start,
						length,
						searchTerm: searchTerm || "",
						order,
					},
				})
				.then((res: AxiosResponse<IDataTableResponse<Model>>) => res.data);
	}
}

export {
	ApiDataTableDataProvider,
};
