import { Request, Response, NextFunction } from "express";
import { jwt } from "../server";

export const authToken = async (req: Request, res: Response) => {
  const { cookies } = req;
  if (cookies.token !== "") {
    await jwt.verify(
      cookies["token"],
      process.env.TOKEN,
      (err: string, user: object) => {
        if (err) {
          res.clearCookie("token");
          res.status(401).send({
            message: "token is invalid",
          });
        } else {
          res.status(200).send({
            message: "token is valid",
            user,
          });
        }
      }
    );
    return;
  }

  res.status(400).send(JSON.stringify(cookies.token));
  return;
};
