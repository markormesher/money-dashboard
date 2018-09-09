import Express = require("express");
import {Request, Response} from "express";
import Passport = require("passport");

const router = Express.Router();

router.get("/old-index", (req: Request, res: Response) => res.redirect("/auth/login"));

router.get("/login", (req: Request, res: Response) => {
	res.render("auth/login", {
		_: {
			title: "Login",
			activePage: "auth",
		},
	});
});

router.get("/google/login", Passport.authenticate("google", {
	scope: ["https://www.googleapis.com/auth/plus.login"],
}));

router.get("/google/callback", Passport.authenticate("google", {
	successRedirect: "/",
	failureRedirect: "/auth/login",
}));

router.get("/logout", (req: Request, res: Response) => {
	req.logout();
	res.flash("info", "You have been logged out.");
	res.redirect("/auth/login");
});

export = router;
