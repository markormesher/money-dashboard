import Express = require('express');
import {Request, Response} from 'express';
import AuthHelper = require('../helpers/auth-helper');

const router = Express.Router();

router.get('/', AuthHelper.requireUser, (req: Request, res: Response) => {
	res.render('dashboard/index', {
		_: {
			activePage: 'dashboard',
		}
	})
});

export = router;
