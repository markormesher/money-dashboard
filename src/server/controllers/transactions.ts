import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import * as Moment from "moment";
import { Brackets } from "typeorm";
import { getDataForTable } from "../helpers/datatable-helper";
import { deleteTransaction, getAllPayees, saveTransaction } from "../managers/transaction-manager";
import { requireUser } from "../middleware/auth-middleware";
import { DbTransaction } from "../models/db/DbTransaction";
import { DbUser } from "../models/db/DbUser";
import { DateModeOption } from "../models/ITransaction";

const router = Express.Router();

router.get("/table-data", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	const searchTerm = req.query.searchTerm || "";

	const dateMode: DateModeOption = req.query.dateMode || "transaction";
	const dateField = `transaction.${dateMode}Date`;
	if (req.query.order) {
		const order: Array<[string, string]> = req.query.order;
		for (const [i, o] of order.entries()) {
			if (o[0] === "__date__") {
				order[i][0] = dateField;
			}
		}
		req.query.order = order;
	}

	const totalQuery = DbTransaction
			.createQueryBuilder("transaction")
			.where("transaction.profile_id = :profileId")
			.andWhere("transaction.deleted = FALSE")
			.setParameters({
				profileId: user.activeProfile.id,
			});

	const filteredQuery = DbTransaction
			.createQueryBuilder("transaction")
			.leftJoinAndSelect("transaction.category", "category")
			.leftJoinAndSelect("transaction.account", "account")
			.where("transaction.profile_id = :profileId")
			.andWhere("transaction.deleted = FALSE")
			.andWhere(new Brackets((qb) => qb.where(
					"transaction.payee ILIKE :searchTerm" +
					" OR transaction.note ILIKE :searchTerm" +
					" OR category.name ILIKE :searchTerm" +
					" OR account.name ILIKE :searchTerm",
			)))
			.setParameters({
				profileId: user.activeProfile.id,
				searchTerm: `%${searchTerm}%`,
			});

	getDataForTable(DbTransaction, req, totalQuery, filteredQuery)
			.then((response) => res.json(response))
			.catch(next);
});

router.post("/edit/:transactionId?", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	const transactionId = req.params.transactionId;
	const properties: Partial<DbTransaction> = {
		transactionDate: Moment(req.body.transactionDate),
		effectiveDate: Moment(req.body.effectiveDate),
		amount: parseFloat(req.body.amount),
		payee: req.body.payee.trim(),
		note: (req.body.note || "").trim(),
		account: req.body.account,
		category: req.body.category,
	};

	if (properties.note.length === 0) {
		properties.note = null;
	}

	saveTransaction(user, transactionId, properties)
			.then(() => res.status(200).end())
			.catch(next);
});

router.post("/delete/:transactionId", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	const transactionId = req.params.transactionId;

	deleteTransaction(user, transactionId)
			.then(() => res.status(200).end())
			.catch(next);
});

router.get("/payees", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	getAllPayees(user)
			.then((payees: string[]) => res.json(payees))
			.catch(next);
});

export {
	router,
};
