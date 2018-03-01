import Express = require('express');

import {Op} from 'sequelize'
import {NextFunction, Request, Response} from 'express';
import AuthHelper = require('../helpers/auth-helper');
import AccountManager = require('../managers/account-manager');
import CategoryManager = require('../managers/category-manager');
import TransactionManager = require('../managers/transaction-manager');
import {Transaction} from '../models/Transaction';
import {getData} from "../helpers/datatable-helper";
import {IFindOptions} from "sequelize-typescript";
import {Category} from "../models/Category";
import {User} from "../models/User";
import {Account} from "../models/Account";
import Bluebird = require("bluebird");
import _ = require("lodash");
import {Budget} from "../models/Budget";

const router = Express.Router();

router.get('/', AuthHelper.requireUser, (req: Request, res: Response) => {
	const user = req.user as User;

	Bluebird
			.all([
				AccountManager.getAllAccounts(user),
				CategoryManager.getAllCategories(user)
			])
			.spread((accounts: Account[], categories: Category[]) => {
				const accountsForView: string[][] = _(accounts)
						.map((a: Account) => [a.id, a.name])
						.sortBy((a: string[]) => a[1])
						.value();
				const categoriesForView: string[][] = _(categories)
						.map((c: Category) => [c.id, c.name])
						.sortBy((c: string[]) => c[1])
						.value();
				return [accountsForView, categoriesForView];
			})
			.spread((accounts: Account[], categories: Category[]) => {
				res.render('transactions/index', {
					_: {
						title: 'Transactions',
						activePage: 'transactions'
					},
					accounts: accounts,
					categories: categories
				});
			});
});

router.get('/table-data', AuthHelper.requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const searchTerm = req.query['search']['value'];

	const countQuery: IFindOptions<Transaction> = {
		where: {
			profileId: user.activeProfile.id
		}
	};
	const dataQuery: IFindOptions<Transaction> = {
		where: {
			[Op.and]: {
				profileId: user.activeProfile.id,
				[Op.or]: {
					payee: {
						[Op.iLike]: `%${searchTerm}%`
					},
					note: {
						[Op.iLike]: `%${searchTerm}%`
					},
					'$category.name$': {
						[Op.iLike]: `%${searchTerm}%`
					},
					'$account.name$': {
						[Op.iLike]: `%${searchTerm}%`
					}
				}
			}
		},
		include: [
			{
				model: Category,
				paranoid: false
			},
			{
				model: Account,
				paranoid: false
			}
		]
	};
	const postOrder = [['createdAt', 'DESC']];

	getData(Transaction, req, countQuery, dataQuery, [], postOrder)
			.then((response) => res.json(response))
			.catch(next);
});

router.post('/edit/:transactionId', AuthHelper.requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const transactionId = req.params['transactionId'] == 'new' ? null : req.params['transactionId'];
	const properties: Partial<Transaction> = {
		transactionDate: new Date(req.body['transactionDate']),
		effectiveDate: new Date(req.body['effectiveDate']),
		amount: parseFloat(req.body['amount']),
		payee: req.body['payee'].trim(),
		note: req.body['note'].trim(),
		accountId: req.body['accountId'],
		categoryId: req.body['categoryId'],
	};

	if (properties.note.length == 0) {
		properties.note = null;
	}

	TransactionManager
			.saveTransaction(user, transactionId, properties)
			.then(() => res.status(200).end())
			.catch(next);
});

router.post('/delete/:transactionId', AuthHelper.requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const transactionId = req.params['transactionId'];

	TransactionManager
			.deleteTransaction(user, transactionId)
			.then(() => res.status(200).end())
			.catch(next);
});

export = router;
