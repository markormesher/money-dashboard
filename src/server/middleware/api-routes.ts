import { Express } from "express";

import { authRouter } from "../controllers/auth";
import { dashboardRouter } from "../controllers/dashboard";
import { assetPerformanceReportRouter } from "../controllers/reports/asset-performance";
import { router as BalanceGraphReportController } from "../controllers/reports/balance-graph";
import { router as BudgetPerformanceReportController } from "../controllers/reports/budget-performance";
import { router as AccountSettingsController } from "../controllers/settings/accounts";
import { router as BudgetSettingsController } from "../controllers/settings/budgets";
import { router as CategorySettingsController } from "../controllers/settings/categories";
import { router as ProfileSettingsController } from "../controllers/settings/profiles";
import { router as TransactionsController } from "../controllers/transactions";

function setupApiRoutes(app: Express) {
	app.use("/", dashboardRouter);
	app.use("/auth", authRouter);
	app.use("/reports/asset-performance", assetPerformanceReportRouter);
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
