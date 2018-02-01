import Bluebird = require("bluebird");
import {Request} from "express";
import {IFindOptions} from "sequelize-typescript";

interface DatatableResponse<T> {
	recordsTotal: number;
	recordsFiltered: number;
	data: T[];
}

// TODO: figure out what type "model" is meant to be

function getData<T>(model: any, req: Request, countFilter: IFindOptions<T>, dataFilter: IFindOptions<T>): Bluebird<DatatableResponse<T>> {

	const offset = parseInt(req.query['start']);
	const limit = parseInt(req.query['length']);

	const columns: { data: string }[] = req.query['columns'];
	const rawOrder: { column: number, dir: string }[] = req.query['order'];
	const order: string[][] = rawOrder.map((rawOrderItem) => {
		return [columns[rawOrderItem.column].data, rawOrderItem.dir];
	});

	dataFilter.order = order;
	dataFilter.offset = offset;
	dataFilter.limit = limit;

	return Bluebird.all([
		model.count(countFilter),
		model.findAll(dataFilter),
	]).then(results => {
		const [totalCount, data] = results;
		return {
			recordsTotal: totalCount,
			recordsFiltered: data.length,
			data: data
		}
	});
}

export {
	getData
}
