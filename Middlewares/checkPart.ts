import { Request, Response, NextFunction } from "express";
import { participants } from "@prisma/client";
import { prisma } from "../server";

export const checkPart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const participant: participants | null = await prisma.participants.findFirst({
    where: {
      AND: [
        {
          userId: req.body.userId,
        },
        {
          eventId: req.body.eventId,
        },
      ],
    },
  });
  prisma.$disconnect();

  if (!participant) {
    res.status(404).send({ messgae: "Participant Not Found" });
    return;
  } else {
    req.body.participant = participant;
    return next();
  }
};
