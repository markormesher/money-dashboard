import * as Express from "express";
import { Request, Response } from "express";
import { requireUser } from "../middleware/auth-middleware";
import { ALL_CURRENCIES } from "../../commons/models/ICurrency";

const router = Express.Router();

router.get("/list", requireUser, (req: Request, res: Response) => {
  res.json(ALL_CURRENCIES);
});

export { router };
