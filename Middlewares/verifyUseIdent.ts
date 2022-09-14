import { Request, Response, NextFunction } from "express";
import { prisma } from "../server";

export const VerifyUserIdent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (Object.keys(req.body).length === 0) {
    res.status(204).send({ message: "no data was recieved" });
    return;
  }

  const user = await prisma.user.count({
    where: {
      OR: [{ username: req.body.username }, { email: req.body.email }],
    },
  });

  if (user !== 0) {
    res.status(409).send({ message: "user already exists" });
    return;
  }

  next();
};
