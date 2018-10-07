import Express = require("express");
import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { IFindOptions } from "sequelize-typescript";
import { getData } from "../../helpers/datatable-helper";
import { deleteCategory, saveCategory } from "../../managers/category-manager";
import { requireUser } from "../../middleware/auth-middleware";
import { Category } from "../../models/Category";
import { User } from "../../models/User";

const router = Express.Router();

router.get("/table-data", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const searchTerm = req.query.searchTerm;

	const countQuery: IFindOptions<Category> = {
		where: {
			profileId: user.activeProfile.id,
		},
	};
	const dataQuery: IFindOptions<Category> = {
		where: {
			[Op.and]: {
				profileId: user.activeProfile.id,
				[Op.or]: {
					name: {
						[Op.iLike]: `%${searchTerm}%`,
					},
				},
			},
		},
	};

	getData(Category, req, countQuery, dataQuery)
			.then((response) => res.json(response))
			.catch(next);
});

router.post("/edit/:categoryId?", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const categoryId = req.params.categoryId;
	const properties: Partial<Category> = {
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
	const user = req.user as User;
	const categoryId = req.params.categoryId;

	deleteCategory(user, categoryId)
			.then(() => res.status(200).end())
			.catch(next);
});

export = router;
