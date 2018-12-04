import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import * as Moment from "moment";
import { Brackets } from "typeorm";
import { getDataForTable } from "../helpers/datatable-helper";
import { deleteTransaction, getAllPayees, saveTransaction } from "../managers/transaction-manager";
import { requireUser } from "../middleware/auth-middleware";
import { DbTransaction } from "../models/db/DbTransaction";
import { DbUser } from "../models/db/DbUser";

const router = Express.Router();

router.get("/table-data", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	const searchTerm = req.query.searchTerm || "";

	// TODO: custom order by date mode
	const dateMode = req.query.dateMode || "transaction";

	const totalQuery = DbTransaction
			.createQueryBuilder("transaction")
			.where("transaction.profile_id = :profileId", { profileId: user.activeProfile.id });

	const filteredQuery = DbTransaction
			.createQueryBuilder("transaction")
			.leftJoin("transaction.category", "category")
			.leftJoin("transaction.account", "account")
			.where("transaction.profile_id = :profileId", { profileId: user.activeProfile.id })
			.andWhere(new Brackets((qb) => qb.where(
					"transaction.payee ILIKE :searchTerm" +
					" OR transaction.note ILIKE :searchTerm" +
					" OR category.name ILIKE :searchTerm" +
					" OR account.name ILIKE :searchTerm",
					{ searchTerm: `%${searchTerm}%` },
			)));

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
