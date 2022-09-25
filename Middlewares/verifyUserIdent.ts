import { Request, Response, NextFunction } from "express";

export const VerifyUserIdent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    Object.keys(req.body).length === 0 ||
    req.body.password === undefined ||
    req.body.email === undefined
  ) {
    res.status(401).send({ message: "please provide valid data" });
    return;
  }

  next();
};
