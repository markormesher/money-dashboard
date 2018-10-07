import Express = require("express");
import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { IFindOptions } from "sequelize-typescript";
import { getData } from "../../helpers/datatable-helper";
import { deleteAccount, saveAccount, toggleAccountActive } from "../../managers/account-manager";
import { requireUser } from "../../middleware/auth-middleware";
import { Account } from "../../models/Account";
import { User } from "../../models/User";

const router = Express.Router();

router.get("/table-data", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const searchTerm = req.query.searchTerm;
	const currentOnly = req.query.activeOnly === "true";

	const activeOnlyQueryFragment = currentOnly ? {
		[Op.and]: {
			active: true,
		},
	} : {};

	const countQuery: IFindOptions<Account> = {
		where: {
			profileId: user.activeProfile.id,
		},
	};
	const dataQuery: IFindOptions<Account> = {
		where: {
			[Op.and]: {
				profileId: user.activeProfile.id,
				[Op.or]: {
					name: {
						[Op.iLike]: `%${searchTerm}%`,
					},
					type: {
						[Op.iLike]: `%${searchTerm}%`,
					},
				},
				[Op.and]: activeOnlyQueryFragment,
			},
		},
	};

	getData(Account, req, countQuery, dataQuery)
			.then((response) => res.json(response))
			.catch(next);
});

router.post("/edit/:accountId?", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const accountId = req.params.accountId;
	const properties: Partial<Account> = {
		name: req.body.name,
		type: req.body.type,
	};

	saveAccount(user, accountId, properties)
			.then(() => res.sendStatus(200))
			.catch(next);
});

router.post("/toggle-active/:accountId", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const accountId = req.params.accountId;

	toggleAccountActive(user, accountId)
			.then(() => res.status(200).end())
			.catch(next);
});

router.post("/delete/:accountId", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const accountId = req.params.accountId;

	deleteAccount(user, accountId)
			.then(() => res.status(200).end())
			.catch(next);
});

export = router;
