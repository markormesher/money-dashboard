import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { IFindOptions } from "sequelize-typescript";
import { getData } from "../helpers/datatable-helper";
import { deleteTransaction, getAllPayees, saveTransaction } from "../managers/transaction-manager";
import { requireUser } from "../middleware/auth-middleware";
import { Account } from "../models/Account";
import { Category } from "../models/Category";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";

const router = Express.Router();

router.get("/table-data", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const searchTerm = req.query.searchTerm || "";
	const dateMode = req.query.dateMode || "transaction";
	const order: string[][] = req.query.order || [];

	const countQuery: IFindOptions<Transaction> = {
		where: {
			profileId: user.activeProfile.id,
		},
	};
	const dataQuery: IFindOptions<Transaction> = {
		where: {
			[Op.and]: {
				profileId: user.activeProfile.id,
				[Op.or]: {
					"payee": {
						[Op.iLike]: `%${searchTerm}%`,
					},
					"note": {
						[Op.iLike]: `%${searchTerm}%`,
					},
					"$category.name$": {
						[Op.iLike]: `%${searchTerm}%`,
					},
					"$account.name$": {
						[Op.iLike]: `%${searchTerm}%`,
					},
				},
			},
		},
		include: [
			{
				model: Category,
				paranoid: false,
			},
			{
				model: Account,
				paranoid: false,
			},
		],
	};

	// fix "displayDate" to "effectiveDate" or "transactionDate"
	for (const i in order) {
		if (order[i][0] === "displayDate") {
			order[i][0] = dateMode + "Date";
		}
	}
	req.query.order = order;
	const postOrder = [["createdAt", "desc"]];

	getData(Transaction, req, countQuery, dataQuery, [], postOrder)
			.then((response) => res.json(response))
			.catch(next);
});

router.post("/edit/:transactionId?", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const transactionId = req.params.transactionId;
	const properties: Partial<Transaction> = {
		transactionDate: new Date(req.body.transactionDate),
		effectiveDate: new Date(req.body.effectiveDate),
		amount: parseFloat(req.body.amount),
		payee: req.body.payee.trim(),
		note: (req.body.note || "").trim(),
		accountId: req.body.accountId,
		categoryId: req.body.categoryId,
	};

	if (properties.note.length === 0) {
		properties.note = null;
	}

	saveTransaction(user, transactionId, properties)
			.then(() => res.status(200).end())
			.catch(next);
});

router.post("/delete/:transactionId", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const transactionId = req.params.transactionId;

	deleteTransaction(user, transactionId)
			.then(() => res.status(200).end())
			.catch(next);
});

router.get("/payees", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	getAllPayees(user)
			.then((payees: string[]) => res.json(payees))
			.catch(next);
});

export {
	router,
};
