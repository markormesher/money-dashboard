import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { Brackets } from "typeorm";
import { getDataForTable } from "../helpers/datatable-helper";
import {
	deleteAccount,
	getAccountBalances,
	getAllAccounts,
	saveAccount,
	toggleAccountActive,
} from "../managers/account-manager";
import { requireUser } from "../middleware/auth-middleware";
import { DbAccount } from "../models/db/DbAccount";
import { DbUser } from "../models/db/DbUser";
import { IAccountBalance } from "../models/IAccountBalance";

const router = Express.Router();

router.get("/table-data", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	const searchTerm = req.query.searchTerm;
	const activeOnly = req.query.activeOnly === "true";

	const totalQuery = DbAccount
			.createQueryBuilder("account")
			.where("account.profile_id = :profileId")
			.setParameters({
				profileId: user.activeProfile.id,
			});

	let filteredQuery = DbAccount
			.createQueryBuilder("account")
			.where("account.profile_id = :profileId")
			.andWhere(new Brackets((qb) => qb.where(
					"account.name ILIKE :searchTerm" +
					" OR account.type ILIKE :searchTerm",
			)))
			.setParameters({
				profileId: user.activeProfile.id,
				searchTerm: `%${searchTerm}%`,
			});

	if (activeOnly) {
		filteredQuery = filteredQuery.andWhere("active = TRUE");
	}

	getDataForTable(DbAccount, req, totalQuery, filteredQuery)
			.then((response) => res.json(response))
			.catch(next);
});

router.get("/list", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	getAllAccounts(user)
			.then((accounts: DbAccount[]) => res.json(accounts))
			.catch(next);
});

router.get("/balances", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	getAccountBalances(user)
			.then((balances: IAccountBalance[]) => res.json(balances))
			.catch(next);
});

router.post("/edit/:accountId?", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	const accountId = req.params.accountId;
	const properties: Partial<DbAccount> = {
		name: req.body.name,
		type: req.body.type,
	};

	saveAccount(user, accountId, properties)
			.then(() => res.sendStatus(200))
			.catch(next);
});

router.post("/toggle-active/:accountId", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	const accountId = req.params.accountId;

	toggleAccountActive(user, accountId)
			.then(() => res.status(200).end())
			.catch(next);
});

router.post("/delete/:accountId", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	const accountId = req.params.accountId;

	deleteAccount(user, accountId)
			.then(() => res.status(200).end())
			.catch(next);
});

export {
	router,
};
