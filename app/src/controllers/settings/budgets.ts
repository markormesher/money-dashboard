import Express = require('express');

import {Op} from 'sequelize'
import {NextFunction, Request, Response} from 'express';
import AuthHelper = require('../../helpers/auth-helper');
import BudgetManager = require('../../managers/budget-manager');
import CategoryManager = require('../../managers/category-manager');
import {Budget} from '../../models/Budget';
import {getData} from "../../helpers/datatable-helper";
import {IFindOptions} from "sequelize-typescript";
import {Category} from "../../models/Category";
import Bluebird = require("bluebird");
import _ = require("lodash");
import {sortBy} from "async";

const router = Express.Router();

router.get('/', AuthHelper.requireUser, (req: Request, res: Response) => {
	res.render('settings/budgets/index', {
		_: {
			title: 'Budgets',
			activePage: 'settings/budgets'
		}
	});
});

router.get('/table-data', AuthHelper.requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	const searchTerm = req.query['search']['value'];

	// TODO: sorting
	// TODO: current only

	const countQuery: IFindOptions<Budget> = {
		where: {
			profileId: user.activeProfile.id
		}
	};
	const dataQuery: IFindOptions<Budget> = {
		where: {
			[Op.and]: {
				profileId: user.activeProfile.id,
				[Op.or]: {
					type: {
						[Op.iLike]: `%${searchTerm}%`
					}
				}
			}
		},
		include: [{
			model: Category,
			where: {
				name: {
					[Op.iLike]: `%${searchTerm}%`
				}
			}
		}]
	};

	getData(Budget, req, countQuery, dataQuery)
			.then((response) => res.json(response))
			.catch(next);
});

router.get('/edit/:budgetId?', AuthHelper.requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	const budgetId = req.params['budgetId'];

	Bluebird
			.all([
				BudgetManager.getBudget(user, budgetId),
				CategoryManager.getAllCategories(user)
			])
			.spread((budget: Budget, categories: Category[]) => {
				// convert categories to [[id, name], [id, name], ...]
				const categoriesForView: string[][] = _(categories)
						.map((c: Category) => [c.id, c.name])
						.sortBy((c: string[]) => c[1])
						.value();

				res.render('settings/budgets/edit', {
					_: {
						activePage: 'settings/budget',
						title: budgetId ? 'Edit Budget' : 'New Budget'
					},
					budget: budget || new Budget(),
					categories: categoriesForView
				});
			})
			.catch(next);
});

router.post('/edit/:budgetId', AuthHelper.requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	const budgetId = req.params['budgetId'];
	const properties: Partial<Budget> = {
		categoryId: req.body['category'],
		type: req.body['type'],
		amount: parseFloat(req.body['amount']),
		startDate: new Date(req.body['startDate']),
		endDate: new Date(req.body['endDate'])
	};

	BudgetManager
			.saveBudget(user, budgetId, properties)
			.then(() => {
				res.flash('success', 'Budget saved');
				res.redirect('/settings/budgets');
			})
			.catch(next);
});

router.post('/delete/:budgetId', AuthHelper.requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	const budgetId = req.params['budgetId'];

	BudgetManager
			.deleteBudget(user, budgetId)
			.then(() => res.status(200).end())
			.catch(next);
});

export = router;
