import * as Express from "express";
import { Request, Response } from "express";

const router = Express.Router();

router.get("/current-user", (req: Request, res: Response) => {
  res.json(req.user); // may be undefined
});

export { router };
