import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { DbProfile } from "../db/models/DbProfile";
import { DbUser } from "../db/models/DbUser";
import { getDataForTable } from "../helpers/datatable-helper";
import {
  deleteProfile,
  getProfileQueryBuilder,
  saveProfile,
  setActiveProfileForUser,
  getAllProfiles,
} from "../managers/profile-manager";

const router = Express.Router();

router.get("/table-data", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const searchTerm = req.query.searchTerm;

  const totalQuery = getProfileQueryBuilder({ withUsers: true })
    .where("user.id = :userId")
    .andWhere("profile.deleted = FALSE")
    .setParameters({
      userId: user.id,
    });

  const filteredQuery = getProfileQueryBuilder({ withUsers: true })
    .where("user.id = :userId")
    .andWhere("profile.deleted = FALSE")
    .andWhere("profile.name ILIKE :searchTerm")
    .setParameters({
      userId: user.id,
      searchTerm: `%${searchTerm}%`,
    });

  getDataForTable(DbProfile, req, totalQuery, filteredQuery)
    .then((response) => res.json(response))
    .catch(next);
});

router.get("/list", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  getAllProfiles(user)
    .then((profiles: DbProfile[]) => res.json(profiles))
    .catch(next);
});

router.post("/edit/:profileId?", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const profileId = req.params.profileId;
  const properties: Partial<DbProfile> = {
    name: req.body.name,
  };

  saveProfile(user, profileId, properties)
    .then(() => res.status(200).end())
    .catch(next);
});

router.post("/delete/:profileId", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const profileId = req.params.profileId;

  deleteProfile(user, profileId)
    .then(() => res.status(200).end())
    .catch(next);
});

router.post("/select/:profileId", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const profileId = req.params.profileId;

  setActiveProfileForUser(user, profileId)
    .then(() => res.status(200).end())
    .catch(next);
});

export { router };
