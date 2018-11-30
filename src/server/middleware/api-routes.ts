import { Express } from "express";
import { router as AccountSettingsController } from "../controllers/accounts";
import { router as AuthRouter } from "../controllers/auth";
import { router as BudgetSettingsController } from "../controllers/budgets";
import { router as CategorySettingsController } from "../controllers/categories";
import { router as ProfileSettingsController } from "../controllers/profiles";
import { router as AssetPerformanceReportRouter } from "../controllers/reports/asset-performance";
import { router as BalanceHistoryReportController } from "../controllers/reports/balance-history";
import { router as TransactionsController } from "../controllers/transactions";

function setupApiRoutes(app: Express): void {
	app.use("/accounts", AccountSettingsController);
	app.use("/auth", AuthRouter);
	app.use("/budgets", BudgetSettingsController);
	app.use("/categories", CategorySettingsController);
	app.use("/profiles", ProfileSettingsController);
	app.use("/reports/asset-performance", AssetPerformanceReportRouter);
	app.use("/reports/balance-history", BalanceHistoryReportController);
	app.use("/transactions", TransactionsController);
}

export {
	setupApiRoutes,
};
