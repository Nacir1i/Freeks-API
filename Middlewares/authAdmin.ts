import { Request, Response, NextFunction } from "express";
import { user, ROLE } from "@prisma/client";

export const authAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("authAdmin");
  const user: user = req.body.user;
  if (user.role !== ROLE.ADMIN) {
    return res.status(403).send();
  }

  next();
  return;
};
