import * as Express from "express";
import { Request, Response } from "express";
import * as Passport from "passport";
import { loadUser } from "../middleware/auth-middleware";

const router = Express.Router();

router.get(
  "/google/login",
  Passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"],
  }),
);

router.get(
  "/google/callback",
  Passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  }),
);

router.get("/current-user", loadUser, (req: Request, res: Response) => {
  res.json(req.user); // may be undefined
});

router.post("/logout", (req: Request, res: Response) => {
  req.logout();
  res.sendStatus(200);
});

export { router };
