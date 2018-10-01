import Bluebird = require("bluebird");
import { Request } from "express";
import { cloneDeep } from "lodash";
import { IFindOptions } from "sequelize-typescript";

class DatatableResponse<T> {
	public filteredRowCount: number;
	public totalRowCount: number;
	public data: T[];
}

// TODO: figure out what type "model" is meant to be

function getData<T>(
		model: any,
		req: Request,
		countFilter: IFindOptions<T>,
		dataFilter: IFindOptions<T>,
		preOrder: string[][] = [],
		postOrder: string[][] = [],
): Bluebird<DatatableResponse<T>> {
	const rawOrder: string[][] = req.query.order || [];
	const finalOrdering: string[][] = [];
	preOrder.forEach((o) => finalOrdering.push(o));
	rawOrder.forEach((o) => finalOrdering.push(o));
	postOrder.forEach((o) => finalOrdering.push(o));

	const limitedDataFilter: IFindOptions<T> = cloneDeep(dataFilter);
	limitedDataFilter.offset = parseInt(req.query.start, 10);
	limitedDataFilter.limit = parseInt(req.query.length, 10);
	limitedDataFilter.order = finalOrdering;

	return Bluebird
			.all([
				model.count(countFilter),
				model.count(dataFilter),
				model.findAll(limitedDataFilter),
			])
			.spread((totalCount: number, dataCount: number, data: T[]) => {
				return {
					totalRowCount: totalCount,
					filteredRowCount: dataCount,
					data,
				};
			});
}

export {
	getData,
	DatatableResponse,
};
