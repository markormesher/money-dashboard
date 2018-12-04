import { Request } from "express";
import { SelectQueryBuilder } from "typeorm";
import { BaseModel } from "../models/db/BaseModel";

interface IDataTableResponse<T> {
	readonly filteredRowCount: number;
	readonly totalRowCount: number;
	readonly data: T[];
}

function getDataForTable<T extends BaseModel>(
		model: typeof BaseModel,
		req: Request,
		totalQuery: SelectQueryBuilder<T>,
		filteredQuery: SelectQueryBuilder<T>,
): Promise<IDataTableResponse<T>> {

	// TODO: ordering

	const start = parseInt(req.query.start, 10);
	const length = parseInt(req.query.length, 10);

	totalQuery.printSql();
	filteredQuery.printSql();

	return Promise
			.all([
				totalQuery.getCount(),
				filteredQuery.skip(start).take(length).getManyAndCount(),
			])
			.then((results) => {
				const totalCount = results[0];
				const filteredCount = results[1][1];
				const filteredIds = results[1][0].map((r) => r.id);

				return Promise.all([
					totalCount,
					filteredCount,
					model.findByIds(filteredIds),
				]);
			})
			.then((results) => ({
				totalRowCount: results[0],
				filteredRowCount: results[1],
				data: results[2] as T[],
			}));
}

export {
	getDataForTable,
	IDataTableResponse,
};
