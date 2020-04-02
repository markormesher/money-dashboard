import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { Brackets } from "typeorm";
import { startOfDay } from "date-fns";
import { IBudgetBalance } from "../../commons/models/IBudgetBalance";
import { DbBudget } from "../db/models/DbBudget";
import { DbCategory } from "../db/models/DbCategory";
import { DbUser } from "../db/models/DbUser";
import { getDataForTable } from "../helpers/datatable-helper";
import {
  cloneBudgets,
  deleteBudget,
  getBudgetBalances,
  getBudgetQueryBuilder,
  saveBudget,
} from "../managers/budget-manager";
import { requireUser } from "../middleware/auth-middleware";

const router = Express.Router();

router.get("/table-data", requireUser, (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const searchTerm = req.query.searchTerm;
  const currentOnly = req.query.currentOnly === "true";

  const totalQuery = getBudgetQueryBuilder()
    .where("budget.profile_id = :profileId")
    .andWhere("budget.deleted = FALSE")
    .setParameters({
      profileId: user.activeProfile.id,
    });

  let filteredQuery = getBudgetQueryBuilder({ withCategory: true })
    .where("budget.profile_id = :profileId")
    .andWhere("budget.deleted = FALSE")
    .andWhere(new Brackets((qb) => qb.where("budget.type ILIKE :searchTerm" + " OR category.name ILIKE :searchTerm")))
    .setParameters({
      profileId: user.activeProfile.id,
      searchTerm: `%${searchTerm}%`,
    });

  if (currentOnly) {
    filteredQuery = filteredQuery.andWhere("start_date <= :now AND end_date >= :now").setParameters({
      now: startOfDay(new Date()).getTime(),
    });
  }

  getDataForTable(DbBudget, req, totalQuery, filteredQuery)
    .then((response) => res.json(response))
    .catch(next);
});

router.post("/edit/:budgetId?", requireUser, (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const budgetId = req.params.budgetId;
  const properties: Partial<DbBudget> = {
    category: DbCategory.create({ id: req.body.category.id }),
    type: req.body.type,
    amount: parseFloat(req.body.amount),
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  };

  saveBudget(user, budgetId, properties)
    .then(() => res.status(200).end())
    .catch(next);
});

router.post("/delete/:budgetId", requireUser, (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const budgetId = req.params.budgetId;

  deleteBudget(user, budgetId)
    .then(() => res.status(200).end())
    .catch(next);
});

router.post("/clone", requireUser, (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const budgetIds: string[] = req.body.budgetIds;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  cloneBudgets(user, budgetIds, startDate, endDate)
    .then(() => res.status(200).end())
    .catch(next);
});

router.get("/balances", requireUser, (req: Request, res: Response, next: NextFunction) => {
  getBudgetBalances(req.user as DbUser, true)
    .then((balances: IBudgetBalance[]) => res.json(balances))
    .catch(next);
});

export { router };
