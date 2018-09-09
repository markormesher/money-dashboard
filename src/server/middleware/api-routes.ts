import { Express } from "express";

import AuthController = require("../controllers/auth");
import DashboardController = require("../controllers/dashboard");
import AssetPerformanceReportController = require("../controllers/reports/asset-performance");
import BalanceGraphReportController = require("../controllers/reports/balance-graph");
import BudgetPerformanceReportController = require("../controllers/reports/budget-performance");
import AccountSettingsController = require("../controllers/settings/accounts");
import BudgetSettingsController = require("../controllers/settings/budgets");
import CategorySettingsController = require("../controllers/settings/categories");
import ProfileSettingsController = require("../controllers/settings/profiles");
import TransactionsController = require("../controllers/transactions");

function setupApiRoutes(app: Express) {
	app.use("/", DashboardController);
	app.use("/auth", AuthController);
	app.use("/reports/asset-performance", AssetPerformanceReportController);
	app.use("/reports/balance-graph", BalanceGraphReportController);
	app.use("/reports/budget-performance", BudgetPerformanceReportController);
	app.use("/settings/accounts", AccountSettingsController);
	app.use("/settings/budgets", BudgetSettingsController);
	app.use("/settings/categories", CategorySettingsController);
	app.use("/settings/profiles", ProfileSettingsController);
	app.use("/transactions", TransactionsController);
}

export {
	setupApiRoutes,
};
