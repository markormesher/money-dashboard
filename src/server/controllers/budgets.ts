import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import * as Moment from "moment";
import { Brackets } from "typeorm";
import { getDataForTable } from "../helpers/datatable-helper";
import { cloneBudgets, deleteBudget, getBudgetBalances, saveBudget } from "../managers/budget-manager";
import { requireUser } from "../middleware/auth-middleware";
import { DbBudget } from "../models/db/DbBudget";
import { DbCategory } from "../models/db/DbCategory";
import { DbUser } from "../models/db/DbUser";
import { MomentDateTransformer } from "../models/helpers/MomentDateTransformer";
import { IBudgetBalance } from "../models/IBudgetBalance";
import { DEFAULT_CATEGORY } from "../models/ICategory";

const router = Express.Router();

router.get("/table-data", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	const searchTerm = req.query.searchTerm;
	const currentOnly = req.query.currentOnly === "true";

	const totalQuery = DbBudget
			.createQueryBuilder("budget")
			.where("budget.profile_id = :profileId", { profileId: user.activeProfile.id });

	let filteredQuery = DbBudget
			.createQueryBuilder("budget")
			.leftJoin("budget.category", "category")
			.where("budget.profile_id = :profileId", { profileId: user.activeProfile.id })
			.andWhere(new Brackets((qb) => qb.where(
					"budget.type ILIKE :searchTerm" +
					" OR category.name ILIKE :searchTerm",
					{ searchTerm: `%${searchTerm}%` },
			)));

	if (currentOnly) {
		filteredQuery = filteredQuery.andWhere(
				"start_date <= :now AND end_date >= :now",
				{
					now: MomentDateTransformer.toDbFormat(Moment()),
				},
		);
	}

	getDataForTable(DbBudget, req, totalQuery, filteredQuery)
			.then((response) => res.json(response))
			.catch(next);
});

router.post("/edit/:budgetId?", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	const budgetId = req.params.budgetId;
	const properties: Partial<DbBudget> = {
		category: DbCategory.create({ id: req.body.category.id }),
		type: req.body.type,
		amount: parseFloat(req.body.amount),
		startDate: Moment(req.body.startDate),
		endDate: Moment(req.body.endDate),
	};

	saveBudget(user, budgetId, properties)
			.then(() => res.status(200).end())
			.catch(next);
});

router.post("/delete/:budgetId", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	const budgetId = req.params.budgetId;

	deleteBudget(user, budgetId)
			.then(() => res.status(200).end())
			.catch(next);
});

router.post("/clone", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	const budgetIds: string[] = req.body.budgetIds;
	const startDate = Moment(req.body.startDate);
	const endDate = Moment(req.body.endDate);

	cloneBudgets(user, budgetIds, startDate, endDate)
			.then(() => res.status(200).end())
			.catch(next);
});

router.get("/balances", requireUser, (req: Request, res: Response, next: NextFunction) => {
	getBudgetBalances(req.user as DbUser, true)
			.then((balances: IBudgetBalance[]) => res.json(balances))
			.catch(next);
});

export {
	router,
};
