import Express = require("express");
import { Request, Response } from "express";
import Passport = require("passport");
import { loadUser } from "../middleware/auth-middleware";
import { delay } from "../middleware/delay-middleware";

const router = Express.Router();

router.get("/google/login", Passport.authenticate("google", {
	scope: ["https://www.googleapis.com/auth/plus.login"],
}));

router.get("/google/callback", Passport.authenticate("google", {
	successRedirect: "/",
	failureRedirect: "/auth/login",
}));

router.get("/current-user", delay(1000), loadUser, (req: Request, res: Response) => {
	res.json(req.user); // may be undefined
});

router.post("/logout", (req: Request, res: Response) => {
	req.logout();
	res.sendStatus(200);
});

export = router;
