import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { DbEnvelope } from "../db/models/DbEnvelope";
import { DbUser } from "../db/models/DbUser";
import { getDataForTable } from "../helpers/datatable-helper";
import {
  deleteEnvelope,
  getAllEnvelopes,
  getEnvelopeQueryBuilder,
  saveEnvelope,
  getEnvelopeBalances,
} from "../managers/envelope-manager";
import { IEnvelopeBalance } from "../models/IEnvelopeBalance";

const router = Express.Router();

router.get("/table-data", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  const searchTerm = req.query.searchTerm;

  const totalQuery = getEnvelopeQueryBuilder()
    .where("envelope.profile_id = :profileId")
    .andWhere("envelope.deleted = FALSE")
    .setParameters({
      profileId: user.activeProfile.id,
    });

  const filteredQuery = getEnvelopeQueryBuilder()
    .where("envelope.profile_id = :profileId")
    .andWhere("envelope.deleted = FALSE")
    .andWhere("envelope.name ILIKE :searchTerm")
    .setParameters({
      profileId: user.activeProfile.id,
      searchTerm: `%${searchTerm}%`,
    });

  getDataForTable(DbEnvelope, req, totalQuery, filteredQuery)
    .then((response) => res.json(response))
    .catch(next);
});

router.get("/list", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  getAllEnvelopes(user)
    .then((envelopes: DbEnvelope[]) => res.json(envelopes))
    .catch(next);
});

router.post("/edit/:envelopeId?", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  const envelopeId = req.params.envelopeId;
  const properties: Partial<DbEnvelope> = {
    name: req.body.name,
  };

  saveEnvelope(user, envelopeId, properties)
    .then(() => res.status(200).end())
    .catch(next);
});

router.post("/delete/:envelopeId", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  const envelopeId = req.params.envelopeId;

  deleteEnvelope(user, envelopeId)
    .then(() => res.status(200).end())
    .catch(next);
});

router.get("/balances", (req: Request, res: Response, next: NextFunction) => {
  getEnvelopeBalances(req.user)
    .then((balances: IEnvelopeBalance[]) => res.json(balances))
    .catch(next);
});

export { router };
