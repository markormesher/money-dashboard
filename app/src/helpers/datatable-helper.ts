import Bluebird = require("bluebird");
import {WhereOptions} from "sequelize";
import {Request} from "express";

interface DatatableResponse<T> {
	recordsTotal: number;
	recordsFiltered: number;
	data: T[];
}

// TODO: figure out what type "model" is meant to be

function getData<T>(model: any, req: Request, countFilter: WhereOptions<T>, dataFilter: WhereOptions<T>): Bluebird<DatatableResponse<T>> {

	const offset = parseInt(req.query['start']);
	const limit = parseInt(req.query['length']);

	const columns: { data: string }[] = req.query['columns'];
	const rawOrder: { column: number, dir: string }[] = req.query['order'];
	const order: string[][] = rawOrder.map((rawOrderItem) => {
		return [columns[rawOrderItem.column].data, rawOrderItem.dir];
	});

	return Bluebird.all([
		model.count({where: countFilter}),
		model.findAll({
			where: dataFilter,
			order: order,
			offset: offset,
			limit: limit
		}),
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
