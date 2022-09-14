import { Request, Response, NextFunction } from "express";
import { user, ROLE } from "@prisma/client";

export const authAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: user = req.body.user;
  if (user.role !== ROLE.ADMIN) {
    return res.status(403).send();
  }

  return next();
};
