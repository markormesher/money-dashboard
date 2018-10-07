import Express = require("express");
import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { IFindOptions } from "sequelize-typescript";

import { requireUser } from "../../middleware/auth-middleware";
import { getData } from "../../helpers/datatable-helper";
import { deleteProfile, getProfile, saveProfile } from "../../managers/profile-manager";
import { Profile } from "../../models/Profile";
import { User } from "../../models/User";

const router = Express.Router();

router.get("/old-index", requireUser, (req: Request, res: Response) => {
	res.render("settings/profiles/index", {
		_: {
			title: "Profiles",
			activePage: "settings/profiles",
		},
	});
});

router.get("/table-data", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const searchTerm = req.query.searchTerm;

	// TODO: this is generating the right data but the wrong count

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

router.get("/edit/:profileId?", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const profileId = req.params.profileId;

	getProfile(user, profileId)
			.then((profile) => {
				res.render("settings/profiles/edit", {
					_: {
						activePage: "settings/profiles",
						title: profileId ? "Edit Profile" : "New Profile",
					},
					profile: profile || new Profile(),
				});
			})
			.catch(next);
});

router.post("/edit/:profileId", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const profileId = req.params.profileId;
	const properties: Partial<Profile> = {
		name: req.body.name,
	};

	saveProfile(user, profileId, properties)
			.then(() => {
				// TODO res.flash("success", "Profile saved");
				res.redirect("/settings/profiles");
			})
			.catch(next);
});

router.post("/delete/:profileId", requireUser, (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	const profileId = req.params.profileId;

	deleteProfile(user, profileId)
			.then(() => res.status(200).end())
			.catch(next);
});

router.get("/select/:profileId", requireUser, (req: Request, res: Response) => {
	const user = req.user as User;
	const profileId = req.params.profileId;

	user.activeProfile = user.profiles.find((p: Profile) => p.id === profileId);
	req.login(user, () => res.redirect(req.get("Referrer") || "/"));
});

export = router;
