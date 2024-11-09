import { Request } from "express";
import { SelectQueryBuilder } from "typeorm";
import { IDataTableResponse } from "../models/IDataTableResponse";
import { BaseModel } from "../db/models/BaseModel";

function getDataForTable<T extends BaseModel>(
  model: typeof BaseModel,
  req: Request,
  totalQuery: SelectQueryBuilder<T>,
  filteredQuery: SelectQueryBuilder<T>,
  preOrder?: [string, "ASC" | "DESC"][],
  postOrder?: [string, "ASC" | "DESC"][],
): Promise<IDataTableResponse<T>> {
  const start = parseInt(req.query.start as string, 10);
  const length = parseInt(req.query.length as string, 10);

  const rawOrder = req.query.order as unknown as [string, "ASC" | "DESC"][];
  const order: [string, "ASC" | "DESC"][] = [];
  if (preOrder) {
    preOrder.forEach((o) => order.push(o));
  }
  if (rawOrder) {
    rawOrder.forEach((o) => order.push(o));
  }
  if (postOrder) {
    postOrder.forEach((o) => order.push(o));
  }

  filteredQuery = filteredQuery.skip(start).take(length);
  order.forEach((o) => {
    filteredQuery = filteredQuery.addOrderBy(o[0], o[1]);
  });

  return Promise.all([totalQuery.getCount(), filteredQuery.getManyAndCount()]).then(
    ([totalRowCount, [data, filteredRowCount]]) => ({
      totalRowCount,
      filteredRowCount,
      data,
    }),
  );
}

export { getDataForTable };
