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
  setEnvelopeActive,
  getEnvelopeBalances,
} from "../managers/envelope-manager";
import { IEnvelopeBalance } from "../models/IEnvelopeBalance";

const router = Express.Router();

router.get("/table-data", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const searchTerm = req.query.searchTerm;
  const activeOnly = req.query.activeOnly === "true";

  const totalQuery = getEnvelopeQueryBuilder()
    .where("envelope.profile_id = :profileId")
    .andWhere("envelope.deleted = FALSE")
    .setParameters({
      profileId: user.activeProfile.id,
    });

  let filteredQuery = getEnvelopeQueryBuilder()
    .where("envelope.profile_id = :profileId")
    .andWhere("envelope.deleted = FALSE")
    .andWhere("envelope.name ILIKE :searchTerm")
    .setParameters({
      profileId: user.activeProfile.id,
      searchTerm: `%${searchTerm}%`,
    });

  if (activeOnly) {
    filteredQuery = filteredQuery.andWhere("active = TRUE");
  }

  getDataForTable(DbEnvelope, req, totalQuery, filteredQuery)
    .then((response) => res.json(response))
    .catch(next);
});

router.get("/list", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  getAllEnvelopes(user)
    .then((envelopes: DbEnvelope[]) => res.json(envelopes))
    .catch(next);
});

router.post("/edit/:envelopeId?", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const envelopeId = req.params.envelopeId;
  const properties: Partial<DbEnvelope> = {
    name: req.body.name,
  };

  saveEnvelope(user, envelopeId, properties)
    .then(() => res.status(200).end())
    .catch(next);
});

router.post("/set-active/:envelopeId", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const envelopeId = req.params.envelopeId;

  setEnvelopeActive(user, envelopeId, true)
    .then(() => res.status(200).end())
    .catch(next);
});

router.post("/set-inactive/:envelopeId", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const envelopeId = req.params.envelopeId;

  setEnvelopeActive(user, envelopeId, false)
    .then(() => res.status(200).end())
    .catch(next);
});

router.post("/delete/:envelopeId", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const envelopeId = req.params.envelopeId;

  deleteEnvelope(user, envelopeId)
    .then(() => res.status(200).end())
    .catch(next);
});

router.get("/balances", (req: Request, res: Response, next: NextFunction) => {
  getEnvelopeBalances(req.user as DbUser)
    .then((balances: IEnvelopeBalance[]) => res.json(balances))
    .catch(next);
});

export { router };
