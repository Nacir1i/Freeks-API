import { Request, Response, NextFunction } from "express";
import { prisma } from "../server";

export const VerifyUserIdent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    Object.keys(req.body).length === 0 ||
    req.body.password === "" ||
    req.body.email === ""
  ) {
    res.status(401).send();
    return;
  }

  next();
};
