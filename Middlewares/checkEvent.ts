import { Request, Response, NextFunction } from "express";
import { event } from "@prisma/client";
import { prisma } from "../server";

export const checkEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const event: event | null = await prisma.event.findFirst({
    where: {
      id: req.body.id,
    },
    include: {
      details: true,
      participants: true,
    },
  });
  prisma.$disconnect();
  if (!event) {
    res.status(404).send({ message: "event not found" });
    return;
  }

  req.event = event;
  return next();
};
