import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { Brackets } from "typeorm";
import { getDataForTable } from "../helpers/datatable-helper";
import { deleteProfile, saveProfile, setActiveProfileForUser } from "../managers/profile-manager";
import { requireUser } from "../middleware/auth-middleware";
import { DbProfile } from "../models/db/DbProfile";
import { DbUser } from "../models/db/DbUser";

const router = Express.Router();

router.get("/table-data", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	const searchTerm = req.query.searchTerm;

	const totalQuery = DbProfile
			.createQueryBuilder("profile")
			.leftJoin("profile.users", "user")
			.where("user.id = :userId", { userId: user.id });

	const filteredQuery = DbProfile
			.createQueryBuilder("profile")
			.leftJoin("profile.users", "user")
			.where("user.id = :userId", { userId: user.id })
			.andWhere(new Brackets((qb) => qb.where(
					"profile.name ILIKE :searchTerm",
					{ searchTerm: `%${searchTerm}%` },
			)));

	getDataForTable(DbProfile, req, totalQuery, filteredQuery)
			.then((response) => res.json(response))
			.catch(next);
});

router.post("/edit/:profileId?", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	const profileId = req.params.profileId;
	const properties: Partial<DbProfile> = {
		name: req.body.name,
	};

	saveProfile(user, profileId, properties)
			.then(() => res.status(200).end())
			.catch(next);
});

router.post("/delete/:profileId", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	const profileId = req.params.profileId;

	deleteProfile(user, profileId)
			.then(() => res.status(200).end())
			.catch(next);
});

router.post("/select/:profileId", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as DbUser;
	const profileId = req.params.profileId;

	setActiveProfileForUser(user, profileId)
			.then(() => res.status(200).end())
			.catch(next);
});

export {
	router,
};
