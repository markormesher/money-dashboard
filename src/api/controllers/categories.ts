import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { ICategoryBalance } from "../../commons/models/ICategoryBalance";
import { DbCategory } from "../db/models/DbCategory";
import { DbUser } from "../db/models/DbUser";
import { getDataForTable } from "../helpers/datatable-helper";
import {
	deleteCategory,
	getAllCategories,
	getCategoryQueryBuilder,
	getMemoCategoryBalances,
	saveCategory
} from "../managers/category-manager";
import { requireUser } from "../middleware/auth-middleware";

const router = Express.Router();

router.get("/table-data", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	const searchTerm = req.query.searchTerm;

	const totalQuery = getCategoryQueryBuilder()
			.where("category.profile_id = :profileId")
			.andWhere("category.deleted = FALSE")
			.setParameters({
				profileId: user.activeProfile.id,
			});

	const filteredQuery = getCategoryQueryBuilder()
			.where("category.profile_id = :profileId")
			.andWhere("category.deleted = FALSE")
			.andWhere("category.name ILIKE :searchTerm")
			.setParameters({
				profileId: user.activeProfile.id,
				searchTerm: `%${searchTerm}%`,
			});

	getDataForTable(DbCategory, req, totalQuery, filteredQuery)
			.then((response) => res.json(response))
			.catch(next);
});

router.get("/list", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	getAllCategories(user)
			.then((categories: DbCategory[]) => res.json(categories))
			.catch(next);
});

router.post("/edit/:categoryId?", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	const categoryId = req.params.categoryId;
	const properties: Partial<DbCategory> = {
		name: req.body.name,
		isIncomeCategory: req.body.isIncomeCategory,
		isExpenseCategory: req.body.isExpenseCategory,
		isAssetGrowthCategory: req.body.isAssetGrowthCategory,
		isMemoCategory: req.body.isMemoCategory,
	};

	saveCategory(user, categoryId, properties)
			.then(() => res.status(200).end())
			.catch(next);
});

router.post("/delete/:categoryId", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	const categoryId = req.params.categoryId;

	deleteCategory(user, categoryId)
			.then(() => res.status(200).end())
			.catch(next);
});

router.get("/memo-balances", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;

	getMemoCategoryBalances(user)
			.then((balances: ICategoryBalance[]) => res.json(balances))
			.catch(next);
});

export {
	router,
};
