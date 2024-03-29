import axios, { AxiosResponse } from "axios";
import { stringify } from "qs";
import { IDataTableResponse } from "../../../../../models/IDataTableResponse";
import { ColumnSortEntry } from "../DataTable";
import { IDataTableDataProvider } from "./IDataTableDataProvider";

interface IApiParams {
  readonly [key: string]: number | string | boolean;
}

class ApiDataTableDataProvider<Model> implements IDataTableDataProvider<Model> {
  private static formatOrdering(sortedColumns: ColumnSortEntry[]): string[][] {
    if (!sortedColumns) {
      return [];
    }
    return sortedColumns.map((sortEntry) => [sortEntry.column.sortField, sortEntry.dir]);
  }

  private readonly api: string;
  private readonly apiParamProvider: () => IApiParams;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly apiResponseMapper: (entity: any) => Model;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(api: string, apiParamProvider?: () => IApiParams, apiResponseMapper?: (entity: any) => Model) {
    this.api = api;
    this.apiParamProvider = apiParamProvider;
    this.apiResponseMapper = apiResponseMapper;
  }

  public getData(
    start: number,
    length: number,
    searchTerm?: string,
    sortedColumns?: ColumnSortEntry[],
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
          order: ApiDataTableDataProvider.formatOrdering(sortedColumns),
        },
      })
      .then((res: AxiosResponse<IDataTableResponse<Model>>) => {
        if (this.apiResponseMapper) {
          return {
            ...res.data,
            data: res.data.data.map(this.apiResponseMapper),
          };
        } else {
          return res.data;
        }
      });
  }
}

export { ApiDataTableDataProvider };
