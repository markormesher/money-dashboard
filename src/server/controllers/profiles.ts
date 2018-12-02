import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { IFindOptions } from "sequelize-typescript";
import { getData } from "../helpers/datatable-helper";
import { deleteProfile, saveProfile, setActiveProfileForUser } from "../managers/profile-manager";
import { requireUser } from "../middleware/auth-middleware";
import { Profile } from "../models/Profile";
import { User } from "../models/User";

const router = Express.Router();

router.get("/table-data", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const searchTerm = req.query.searchTerm;

	const countQuery: IFindOptions<Profile> = {
		include: [{
			model: User,
			where: {
				id: user.id,
			},
		}],
	};
	const dataQuery: IFindOptions<Profile> = {
		where: {
			name: { [Op.iLike]: `%${searchTerm}%` },
		},
		include: [{
			model: User,
			where: {
				id: user.id,
			},
		}],
	};

	getData(Profile, req, countQuery, dataQuery)
			.then((response) => res.json(response))
			.catch(next);
});

router.post("/edit/:profileId?", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const profileId = req.params.profileId;
	const properties: Partial<Profile> = {
		name: req.body.name,
	};

	saveProfile(user, profileId, properties)
			.then(() => res.status(200).end())
			.catch(next);
});

router.post("/delete/:profileId", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const profileId = req.params.profileId;

	deleteProfile(user, profileId)
			.then(() => res.status(200).end())
			.catch(next);
});

router.post("/select/:profileId", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const profileId = req.params.profileId;

	setActiveProfileForUser(user, profileId)
			.then(() => res.status(200).end())
			.catch(next);
});

export {
	router,
};
