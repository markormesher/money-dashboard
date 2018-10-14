import * as Bluebird from "bluebird";
import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import * as Moment from "moment";
import { Op } from "sequelize";
import { IFindOptions } from "sequelize-typescript";
import { getData } from "../../helpers/datatable-helper";
import { cloneBudgets, deleteBudget, getBudget, saveBudget } from "../../managers/budget-manager";
import { requireUser } from "../../middleware/auth-middleware";
import { Budget } from "../../models/Budget";
import { Category } from "../../models/Category";
import { User } from "../../models/User";

const router = Express.Router();

function getQuickPeriodDates(): string[][][] {
	const now = Moment();
	const thisTaxYearStart = now.clone().month("april").date(6);
	if (thisTaxYearStart.isAfter(now)) {
		thisTaxYearStart.subtract(1, "year");
	}
	return [];
	/*return [
		[
			[
				"This Month",
				formatDate(now.clone().startOf("month"), "system"),
				formatDate(now.clone().endOf("month"), "system"),
			],
			[
				"This Year",
				formatDate(now.clone().startOf("year"), "system"),
				formatDate(now.clone().endOf("year"), "system"),
			],
			[
				"This Tax Year",
				formatDate(thisTaxYearStart, "system"),
				formatDate(thisTaxYearStart.clone().add(1, "year").date(5), "system"),
			],
		],
		[
			[
				"Next Month",
				formatDate(now.clone().add(1, "month").startOf("month"), "system"),
				formatDate(now.clone().add(1, "month").endOf("month"), "system"),
			],
			[
				"Next Year",
				formatDate(now.clone().add(1, "year").startOf("year"), "system"),
				formatDate(now.clone().add(1, "year").endOf("year"), "system"),
			],
			[
				"Next Tax Year",
				formatDate(thisTaxYearStart.clone().add(1, "year"), "system"),
				formatDate(thisTaxYearStart.clone().add(2, "years").date(5), "system"),
			],
		],
	];*/
}

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

router.get("/clone/:budgetIds", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const budgetIds: string[] = req.params.budgetIds.split(",");

	const tasks = budgetIds.map((id) => getBudget(user, id, true));
	Bluebird.all(tasks)
			.then((budgets: Budget[]) => {
				budgets.sort((a, b) => a.category.name.localeCompare(b.category.name));
				res.render("settings/budgets/clone", {
					_: {
						activePage: "settings/budget",
						title: budgets.length === 1 ? "Clone Budget" : "Clone Budgets",
					},
					budgetIds,
					budgets,
					quickPeriodDates: getQuickPeriodDates(),
				});
			})
			.catch(next);
});

router.post("/clone/:budgetIds", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const budgetIds: string[] = req.params.budgetIds.split(",");
	const startDate = new Date(req.body.startDate);
	const endDate = new Date(req.body.endDate);

	cloneBudgets(user, budgetIds, startDate, endDate)
			.then(() => {
				// TODO res.flash("success", budgetIds.length === 1 ? "Budget saved" : "Budgets saved");
				res.redirect("/settings/budgets");
			})
			.catch(next);
});

export {
	router,
};
