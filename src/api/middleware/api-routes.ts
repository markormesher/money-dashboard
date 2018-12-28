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
	app.use("/api/accounts", AccountSettingsController);
	app.use("/api/auth", AuthRouter);
	app.use("/api/budgets", BudgetSettingsController);
	app.use("/api/categories", CategorySettingsController);
	app.use("/api/profiles", ProfileSettingsController);
	app.use("/api/reports/asset-performance", AssetPerformanceReportRouter);
	app.use("/api/reports/balance-history", BalanceHistoryReportController);
	app.use("/api/transactions", TransactionsController);
}

export {
	setupApiRoutes,
};
