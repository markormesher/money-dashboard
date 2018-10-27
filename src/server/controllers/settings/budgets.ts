import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { IFindOptions } from "sequelize-typescript";
import { getData } from "../../helpers/datatable-helper";
import { cloneBudgets, deleteBudget, saveBudget } from "../../managers/budget-manager";
import { requireUser } from "../../middleware/auth-middleware";
import { Budget } from "../../models/Budget";
import { Category } from "../../models/Category";
import { User } from "../../models/User";

const router = Express.Router();

router.get("/table-data", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const searchTerm = req.query.searchTerm;
	const currentOnly = req.query.currentOnly === "true";
	const now = new Date();

	const currentOnlyQueryFragment = currentOnly ? {
		[Op.and]: {
			startDate: {
				[Op.lte]: now,
			},
			endDate: {
				[Op.gte]: now,
			},
		},
	} : {};

	const countQuery: IFindOptions<Budget> = {
		where: {
			profileId: user.activeProfile.id,
		},
	};
	const dataQuery: IFindOptions<Budget> = {
		where: {
			[Op.and]: {
				profileId: user.activeProfile.id,
				[Op.or]: {
					"type": {
						[Op.iLike]: `%${searchTerm}%`,
					},
					"$category.name$": {
						[Op.iLike]: `%${searchTerm}%`,
					},
				},
				[Op.and]: currentOnlyQueryFragment,
			},
		},
		include: [Category],
	};

	getData(Budget, req, countQuery, dataQuery)
			.then((response) => res.json(response))
			.catch(next);
});

router.post("/edit/:budgetId?", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const budgetId = req.params.budgetId;
	const properties: Partial<Budget> = {
		categoryId: req.body.categoryId,
		type: req.body.type,
		amount: parseFloat(req.body.amount),
		startDate: new Date(req.body.startDate),
		endDate: new Date(req.body.endDate),
	};

	saveBudget(user, budgetId, properties)
			.then(() => res.status(200).end())
			.catch(next);
});

router.post("/delete/:budgetId", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const budgetId = req.params.budgetId;

	deleteBudget(user, budgetId)
			.then(() => res.status(200).end())
			.catch(next);
});

router.post("/clone", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const budgetIds: string[] = req.body.budgetIds;
	const startDate = new Date(req.body.startDate);
	const endDate = new Date(req.body.endDate);

	cloneBudgets(user, budgetIds, startDate, endDate)
			.then(() => res.status(200).end())
			.catch(next);
});

export {
	router,
};
