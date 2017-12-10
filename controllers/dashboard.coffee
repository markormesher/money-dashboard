express = require('express')
async = require('async')
rfr = require('rfr')
auth = rfr('./helpers/auth')
StatisticsManager = rfr('./managers/statistics')
router = express.Router()

router.get('/', auth.checkAndRefuse, (req, res, next) ->
	now = new Date()
	startDate = new Date(now.getFullYear(), now.getMonth(), 1)
	endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)

	async.parallel(
		{
			'accountBalances': (callback) -> StatisticsManager.getAccountBalances(res.locals.user, (err, result) -> callback(err, result))
			'budgets': (callback) -> StatisticsManager.getCurrentBudgets(res.locals.user, (err, result) -> callback(err, result))
			'alerts': (callback) -> StatisticsManager.getAlerts(res.locals.user, (err, result) -> callback(err, result))
			'summaryData': (callback) -> StatisticsManager.getSummaryData(res.locals.user, startDate, endDate, (err, result) -> callback(err, result))
			'starredAccounts': (callback) -> StatisticsManager.getStarredAccountBalanceHistory(res.locals.user, (err, result) -> callback(err, result))
		},
		(err, results) ->
			if (err)
				return next(err)

			res.render('dashboard/index', {
				_: {
					noTitle: true
					activePage: 'dashboard'
				}
				accountBalances: results['accountBalances']
				budgets: results['budgets']
				alerts: results['alerts']
				summaryData: results['summaryData']
				starredAccounts: results['starredAccounts']
			})
	)
)

module.exports = router
