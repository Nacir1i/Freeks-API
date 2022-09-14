import { Request, Response, NextFunction } from "express";
import { user } from "@prisma/client";
import { jwt } from "../server";

export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken: string = req.cookies.authToken;
  if (authToken !== "") {
    const user: user = await jwt.verify(
      authToken,
      process.env.TOKEN,
      (err: string) => {
        if (err) {
          req.body.user = user;
          return res.status(401).send();
        }
        return next();
      }
    );
  }
  return res.status(400).send();
};
