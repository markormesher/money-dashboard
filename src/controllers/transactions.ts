import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { Brackets } from "typeorm";
import { DbTransaction } from "../db/models/DbTransaction";
import { DbUser } from "../db/models/DbUser";
import { getDataForTable } from "../helpers/datatable-helper";
import {
  deleteTransaction,
  getAllPayees,
  getTransactionQueryBuilder,
  saveTransaction,
} from "../managers/transaction-manager";

const router = Express.Router();

router.get("/table-data", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const searchTerm = req.query.searchTerm || "";

  const totalQuery = getTransactionQueryBuilder()
    .where("transaction.profile_id = :profileId")
    .andWhere("transaction.deleted = FALSE")
    .setParameters({
      profileId: user.activeProfile.id,
    });

  const filteredQuery = getTransactionQueryBuilder({ withAccount: true, withCategory: true })
    .where("transaction.profile_id = :profileId")
    .andWhere("transaction.deleted = FALSE")
    .andWhere(
      new Brackets((qb) =>
        qb.where(
          "transaction.payee ILIKE :searchTerm" +
            " OR transaction.note ILIKE :searchTerm" +
            " OR category.name ILIKE :searchTerm" +
            " OR account.name ILIKE :searchTerm",
        ),
      ),
    )
    .setParameters({
      profileId: user.activeProfile.id,
      searchTerm: `%${searchTerm}%`,
    });

  getDataForTable(DbTransaction, req, totalQuery, filteredQuery, [], [["transaction.creationDate", "DESC"]])
    .then((response) => res.json(response))
    .catch(next);
});

router.post("/edit/:transactionId?", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const transactionId = req.params.transactionId;
  const properties: Partial<DbTransaction> = {
    transactionDate: req.body.transactionDate,
    effectiveDate: req.body.effectiveDate,
    amount: parseFloat(req.body.amount),
    payee: req.body.payee.trim(),
    note: (req.body.note || "").trim(),
    account: req.body.account,
    category: req.body.category,
  };

  if (properties.note.length === 0) {
    properties.note = null;
  }

  saveTransaction(user, transactionId, properties)
    .then(() => res.status(200).end())
    .catch(next);
});

router.post("/delete/:transactionId", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const transactionId = req.params.transactionId;

  deleteTransaction(user, transactionId)
    .then(() => res.status(200).end())
    .catch(next);
});

router.get("/payees", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  getAllPayees(user)
    .then((payees: string[]) => res.json(payees))
    .catch(next);
});

export { router };
