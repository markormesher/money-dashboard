import Express = require('express');

import {Op} from 'sequelize'
import {NextFunction, Request, Response} from 'express';
import AuthHelper = require('../../helpers/auth-helper');
import BudgetManager = require('../../managers/budget-manager');
import CategoryManager = require('../../managers/category-manager');
import {Budget} from '../../models/Budget';
import {getData} from "../../helpers/datatable-helper";
import {IFindOptions, Sequelize} from "sequelize-typescript";
import {Category} from "../../models/Category";
import Bluebird = require("bluebird");
import _ = require("lodash");
import * as moment from "moment";
import {formatDate} from "../../helpers/formatters";

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
					},
					'$category.name$': {
						[Op.iLike]: `%${searchTerm}%`
					}
				}
			}
		},
		include: [
			{
				model: Category
			}
		]
	};

	getData(Budget, req, countQuery, dataQuery)
			.then((response) => res.json(response))
			.catch(next);
});

router.get('/edit/:budgetId?', AuthHelper.requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	const budgetId = req.params['budgetId'];

	// dates for quick period links
	const now = moment();
	const thisTaxYearStart = now.clone().month('april').date(6);
	if (thisTaxYearStart.isAfter(now)) {
		thisTaxYearStart.subtract(1, 'year');
	}
	const quickPeriodDates: string[][][] = [
		[
			[
				'This Month',
				formatDate(now.clone().startOf('month'), 'system'),
				formatDate(now.clone().endOf('month'), 'system')
			],
			[
				'This Year',
				formatDate(now.clone().startOf('year'), 'system'),
				formatDate(now.clone().endOf('year'), 'system')
			],
			[
				'This Tax Year',
				formatDate(thisTaxYearStart, 'system'),
				formatDate(thisTaxYearStart.clone().add(1, 'year').date(5), 'system')
			],
		],
		[
			[
				'Next Month',
				formatDate(now.clone().add(1, 'month').startOf('month'), 'system'),
				formatDate(now.clone().add(1, 'month').endOf('month'), 'system')
			],
			[
				'Next Year',
				formatDate(now.clone().add(1, 'year').startOf('year'), 'system'),
				formatDate(now.clone().add(1, 'year').endOf('year'), 'system')
			],
			[
				'Next Tax Year',
				formatDate(thisTaxYearStart.clone().add(1, 'year'), 'system'),
				formatDate(thisTaxYearStart.clone().add(2, 'years').date(5), 'system')
			],
		],
	];

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
					categories: categoriesForView,
					quickPeriodDates: quickPeriodDates
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
