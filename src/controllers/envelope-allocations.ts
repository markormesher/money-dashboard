import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { Brackets } from "typeorm";
import { DbEnvelopeAllocation } from "../db/models/DbEnvelopeAllocation";
import { DbUser } from "../db/models/DbUser";
import { getDataForTable } from "../helpers/datatable-helper";
import {
  deleteEnvelopeAllocation,
  getAllEnvelopeAllocations,
  getEnvelopeAllocationQueryBuilder,
  saveEnvelopeAllocation,
} from "../managers/envelope-allocation-manager";

const router = Express.Router();

router.get("/table-data", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  const searchTerm = req.query.searchTerm;
  const activeOnly = req.query.activeOnly === "true";

  const totalQuery = getEnvelopeAllocationQueryBuilder()
    .where("allocation.profile_id = :profileId")
    .andWhere("allocation.deleted = FALSE")
    .setParameters({
      profileId: user.activeProfile.id,
    });

  const filteredQuery = getEnvelopeAllocationQueryBuilder()
    .where("allocation.profile_id = :profileId")
    .andWhere("allocation.deleted = FALSE")
    .andWhere(new Brackets((qb) => qb.where("category.name ILIKE :searchTerm OR envelope.name ILIKE :searchTerm")))
    .setParameters({
      profileId: user.activeProfile.id,
      searchTerm: `%${searchTerm}%`,
    });

  if (activeOnly) {
    // TODO: active = newest for that category
  }

  getDataForTable(DbEnvelopeAllocation, req, totalQuery, filteredQuery)
    .then((response) => res.json(response))
    .catch(next);
});

router.get("/list", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  getAllEnvelopeAllocations(user)
    .then((envelopes: DbEnvelopeAllocation[]) => res.json(envelopes))
    .catch(next);
});

router.post("/edit/:allocationId?", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  const allocationId = req.params.allocationId;
  const properties: Partial<DbEnvelopeAllocation> = {
    startDate: req.body.startDate,
    category: req.body.category,
    envelope: req.body.envelope,
  };

  saveEnvelopeAllocation(user, allocationId, properties)
    .then(() => res.status(200).end())
    .catch(next);
});

router.post("/delete/:allocationId", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  const allocationId = req.params.allocationId;

  deleteEnvelopeAllocation(user, allocationId)
    .then(() => res.status(200).end())
    .catch(next);
});

export { router };
