import Express = require('express');

import {Op} from 'sequelize'
import {NextFunction, Request, Response} from 'express';
import AuthHelper = require('../../helpers/auth-helper');
import BudgetManager = require('../../managers/budget-manager');
import {Budget} from '../../models/Budget';
import {getData} from "../../helpers/datatable-helper";
import {IFindOptions} from "sequelize-typescript";
import {Category} from "../../models/Category";

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

	BudgetManager
			.getBudget(user, budgetId)
			.then(budget => {
				res.render('settings/budgets/edit', {
					_: {
						activePage: 'settings/budget',
						title: budgetId ? 'Edit Budget' : 'New Budget'
					},
					budget: budget || new Budget()
				});
			})
			.catch(next);
});

router.post('/edit/:budgetId', AuthHelper.requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	const budgetId = req.params['budgetId'];
	const properties: Partial<Budget> = {
		type: req.body['type'],
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
