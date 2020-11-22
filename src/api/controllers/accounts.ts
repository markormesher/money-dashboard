import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { Brackets } from "typeorm";
import { IAccountBalance } from "../../commons/models/IAccountBalance";
import { DbAccount } from "../db/models/DbAccount";
import { DbUser } from "../db/models/DbUser";
import { getDataForTable } from "../helpers/datatable-helper";
import {
  deleteAccount,
  getAccountBalances,
  getAccountQueryBuilder,
  getAllAccounts,
  saveAccount,
  setAccountActive,
  updateAssetBalance,
} from "../managers/account-manager";
import { requireUser } from "../middleware/auth-middleware";
import { IAccountBalanceUpdate } from "../../commons/models/IAccountBalanceUpdate";
import { logger } from "../../commons/utils/logging";

const router = Express.Router();

router.get("/table-data", requireUser, (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const searchTerm = req.query.searchTerm;
  const activeOnly = req.query.activeOnly === "true";

  const totalQuery = getAccountQueryBuilder()
    .where("account.profile_id = :profileId")
    .andWhere("account.deleted = FALSE")
    .setParameters({
      profileId: user.activeProfile.id,
    });

  let filteredQuery = getAccountQueryBuilder()
    .where("account.profile_id = :profileId")
    .andWhere("account.deleted = FALSE")
    .andWhere(new Brackets((qb) => qb.where("account.name ILIKE :searchTerm" + " OR account.type ILIKE :searchTerm")))
    .setParameters({
      profileId: user.activeProfile.id,
      searchTerm: `%${searchTerm}%`,
    });

  if (activeOnly) {
    filteredQuery = filteredQuery.andWhere("active = TRUE");
  }

  getDataForTable(DbAccount, req, totalQuery, filteredQuery)
    .then((response) => res.json(response))
    .catch(next);
});

router.get("/list", requireUser, (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  getAllAccounts(user)
    .then((accounts: DbAccount[]) => res.json(accounts))
    .catch(next);
});

router.get("/balances", requireUser, (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  getAccountBalances(user)
    .then((balances: IAccountBalance[]) => res.json(balances))
    .catch(next);
});

router.post("/edit/:accountId?", requireUser, (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const accountId = req.params.accountId;
  const properties: Partial<DbAccount> = {
    name: req.body.name,
    type: req.body.type,
    currencyCode: req.body.currencyCode,
    tags: req.body.tags,
    note: req.body.note,
  };

  saveAccount(user, accountId, properties)
    .then(() => res.sendStatus(200))
    .catch(next);
});

router.post("/set-active/:accountId", requireUser, (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const accountId = req.params.accountId;

  setAccountActive(user, accountId, true)
    .then(() => res.status(200).end())
    .catch(next);
});

router.post("/set-inactive/:accountId", requireUser, (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const accountId = req.params.accountId;

  setAccountActive(user, accountId, false)
    .then(() => res.status(200).end())
    .catch(next);
});

router.post("/delete/:accountId", requireUser, (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const accountId = req.params.accountId;

  deleteAccount(user, accountId)
    .then(() => res.status(200).end())
    .catch(next);
});

router.post("/asset-balance-update", requireUser, (req: Request, res: Response, next: NextFunction) => {
  logger.info("Calling API");
  const user = req.user as DbUser;
  const update: IAccountBalanceUpdate = req.body.balanceUpdate;

  logger.debug(update);

  updateAssetBalance(user, update)
    .then(() => res.sendStatus(200))
    .catch(next);
});

export { router };
