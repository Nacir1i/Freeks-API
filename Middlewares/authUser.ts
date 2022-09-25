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
    try {
      await jwt.verify(authToken, process.env.TOKEN, (err: any, user: user) => {
        if (err) {
          res.status(401).send({ message: "Access token no valid" });
        } else {
          req.body.user = user;
          next();
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Internal server error" });
    }

    return;
  }
  return res.status(400).send({ message: "No access token was found" });
};
