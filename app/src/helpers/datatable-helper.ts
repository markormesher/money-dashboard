import Bluebird = require("bluebird");
import cloneDeep = require('lodash.clonedeep');
import { Request } from "express";
import { IFindOptions } from "sequelize-typescript";

interface DatatableResponse<T> {
	recordsTotal: number;
	recordsFiltered: number;
	data: T[];
}

// TODO: figure out what type "model" is meant to be

function getData<T>(model: any, req: Request, countFilter: IFindOptions<T>, dataFilter: IFindOptions<T>, preOrder: string[][] = [], postOrder: string[][] = []): Bluebird<DatatableResponse<T>> {
	const columns: { name: string, data: string }[] = req.query['columns'];
	const rawOrder: { column: number, dir: string }[] = req.query['order'];
	const finalOrdering: string[][] = [];
	preOrder.forEach(o => finalOrdering.push(o));
	rawOrder
			.map((rawOrderItem) => {
				const column = columns[rawOrderItem.column];
				const columnName = column.name || column.data;
				const dir = rawOrderItem.dir;

				const ordering = columnName.split('.');
				ordering.push(dir.toUpperCase());
				return ordering;
			})
			.forEach(o => finalOrdering.push(o));
	postOrder.forEach(o => finalOrdering.push(o));

	const limitedDataFilter: IFindOptions<T> = cloneDeep(dataFilter);
	limitedDataFilter.offset = parseInt(req.query['start']);
	limitedDataFilter.limit = parseInt(req.query['length']);
	limitedDataFilter.order = finalOrdering;

	return Bluebird.all([
		model.count(countFilter),
		model.count(dataFilter),
		model.findAll(limitedDataFilter),
	]).spread((totalCount: number, dataCount: number, data: T[]) => {
		return {
			recordsTotal: totalCount,
			recordsFiltered: dataCount,
			data: data
		}
	});
}

export {
	getData
}
