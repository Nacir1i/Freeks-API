import { Request, Response, NextFunction } from "express";
import { user } from "@prisma/client";
import { jwt } from "../server";

export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("authUser");

  const authToken: string = req.cookies.authToken;
  if (authToken !== "") {
    try {
      await jwt.verify(authToken, process.env.TOKEN, (err: any, user: user) => {
        if (err) {
          res.status(401).send();
        } else {
          req.body.user = user;
          next();
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }

    return;
  }
  return res.status(400).send();
};
