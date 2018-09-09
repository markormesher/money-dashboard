import Express = require("express");
import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { IFindOptions } from "sequelize-typescript";

import { requireUser } from "../../helpers/auth-helper";
import { getData } from "../../helpers/datatable-helper";
import { deleteCategory, getCategory, saveCategory } from "../../managers/category-manager";
import { Category } from "../../models/Category";
import { User } from "../../models/User";

const router = Express.Router();

router.get("/old-index", requireUser, (req: Request, res: Response) => {
	res.render("settings/categories/index", {
		_: {
			title: "Categories",
			activePage: "settings/categories",
		},
	});
});

router.get("/table-data", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const searchTerm = req.query.search.value;

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

router.get("/edit/:categoryId?", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const categoryId = req.params.categoryId;

	getCategory(user, categoryId)
			.then((category) => {
				res.render("settings/categories/edit", {
					_: {
						activePage: "settings/category",
						title: categoryId ? "Edit Category" : "New Category",
					},
					category: category || new Category(),
				});
			})
			.catch(next);
});

router.post("/edit/:categoryId", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const categoryId = req.params.categoryId;
	const rawTypes = req.body["types[]"] as string[] || [];
	const properties: Partial<Category> = {
		name: req.body.name,
		isMemoCategory: rawTypes.indexOf("memo") >= 0,
		isIncomeCategory: rawTypes.indexOf("income") >= 0,
		isExpenseCategory: rawTypes.indexOf("expense") >= 0,
		isAssetGrowthCategory: rawTypes.indexOf("asset-growth") >= 0,
	};

	saveCategory(user, categoryId, properties)
			.then(() => {
				res.flash("success", "Category saved");
				res.redirect("/settings/categories");
			})
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
