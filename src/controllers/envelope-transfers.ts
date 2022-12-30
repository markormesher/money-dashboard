import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { Brackets } from "typeorm";
import { DbEnvelopeTransfer } from "../db/models/DbEnvelopeTransfer";
import { DbUser } from "../db/models/DbUser";
import { getDataForTable } from "../helpers/datatable-helper";
import {
  deleteEnvelopeTransfer,
  getAllEnvelopeTransfers,
  getEnvelopeTransferQueryBuilder,
  saveEnvelopeTransfer,
} from "../managers/envelope-transfer-manager";

const router = Express.Router();

router.get("/table-data", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const searchTerm = req.query.searchTerm;

  const totalQuery = getEnvelopeTransferQueryBuilder()
    .where("transfer.profile_id = :profileId")
    .andWhere("transfer.deleted = FALSE")
    .setParameters({
      profileId: user.activeProfile.id,
    });

  const filteredQuery = getEnvelopeTransferQueryBuilder()
    .where("transfer.profile_id = :profileId")
    .andWhere("transfer.deleted = FALSE")
    .andWhere(
      new Brackets((qb) => qb.where("from_envelope.name ILIKE :searchTerm OR to_envelope.name ILIKE :searchTerm")),
    )
    .setParameters({
      profileId: user.activeProfile.id,
      searchTerm: `%${searchTerm}%`,
    });

  getDataForTable(DbEnvelopeTransfer, req, totalQuery, filteredQuery)
    .then((response) => res.json(response))
    .catch(next);
});

router.get("/list", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  getAllEnvelopeTransfers(user)
    .then((envelopes: DbEnvelopeTransfer[]) => res.json(envelopes))
    .catch(next);
});

router.post("/edit/:transferId?", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const transferId = req.params.transferId;
  const properties: Partial<DbEnvelopeTransfer> = {
    date: req.body.date,
    amount: parseFloat(req.body.amount),
    note: (req.body.note || "").trim(),
    fromEnvelope: req.body.fromEnvelope,
    toEnvelope: req.body.toEnvelope,
  };

  saveEnvelopeTransfer(user, transferId, properties)
    .then(() => res.status(200).end())
    .catch(next);
});

router.post("/delete/:transferId", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const transferId = req.params.transferId;

  deleteEnvelopeTransfer(user, transferId)
    .then(() => res.status(200).end())
    .catch(next);
});

export { router };
