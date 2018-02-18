import Bluebird = require("bluebird");
import _ = require('lodash');
import {Request} from "express";
import {IFindOptions, Model} from "sequelize-typescript";
import {User} from "../models/User";
import {Budget} from "../models/Budget";
import {Category} from "../models/Category";
import {Profile} from "../models/Profile";
import {Account} from "../models/Account";

interface DatatableResponse<T> {
	recordsTotal: number;
	recordsFiltered: number;
	data: T[];
}

const models: { [key: string]: typeof Model } = {
	'account': Account,
	'budget': Budget,
	'category': Category,
	'profile': Profile,
	'user': User
};

// TODO: figure out what type "model" is meant to be

function getData<T>(model: any, req: Request, countFilter: IFindOptions<T>, dataFilter: IFindOptions<T>): Bluebird<DatatableResponse<T>> {
	const columns: { data: string }[] = req.query['columns'];
	const rawOrder: { column: number, dir: string }[] = req.query['order'];

	const limitedDataFilter = _.cloneDeep(dataFilter);
	limitedDataFilter.offset = parseInt(req.query['start']);
	limitedDataFilter.limit = parseInt(req.query['length']);
	/*limitedDataFilter.order = rawOrder.map((rawOrderItem) => {
		const col = columns[rawOrderItem.column].data;
		const dir = rawOrderItem.dir;

		if (col.indexOf('.') >= 0) {
			const order: any[] = [];
			const chunks = col.split('.');
			chunks.forEach((chunk, i) => {
				if (i < chunks.length - 1) {
					order.push({ model: models[chunk] });
				} else {
					order.push(chunk);
				}
			});
			order.push(dir);
			return order;
		} else {
			return [col, dir];
		}
	});*/

	console.log(limitedDataFilter.order);

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
