import { Request, Response, NextFunction } from "express";
import { jwt } from "../server";

export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (token !== "") {
    await jwt.verify(token, process.env.TOKEN, (err: string) => {
      if (err) {
        res.status(401).send({
          message: "token is invalid",
        });
      } else {
        next();
      }
    });
    return;
  }
  res.status(400).send({
    message: "no access token was found",
  });
  return;
};
