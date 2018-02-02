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
	const columns: { data: string }[] = req.query['columns'];
	const rawOrder: { column: number, dir: string }[] = req.query['order'];

	dataFilter.offset = parseInt(req.query['start']);
	dataFilter.limit = parseInt(req.query['length']);
	dataFilter.order = rawOrder.map((rawOrderItem) => {
		return [columns[rawOrderItem.column].data, rawOrderItem.dir];
	});

	return Bluebird.all([
		model.count(countFilter),
		model.findAll(dataFilter),
	]).spread((totalCount: number, data: T[]) => {
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
