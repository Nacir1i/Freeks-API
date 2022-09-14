import { prisma } from "../server";
import { participants } from "@prisma/client";

export const initiateRound = async (list: Array<participants>) => {
  if (list.length > 2) {
    const fistHalf = list.slice(0, Math.ceil(list.length / 2));
    await initiateRound(fistHalf);
    const secondHalf = list.slice(Math.ceil(list.length / 2));
    await initiateRound(secondHalf);
  } else {
    await prisma.matches.create({
      data: {
        eventId: list[0].eventId,
        startedAt: "2022-09-06T02:52:03.731Z",
        endedAt: "2022-09-06T02:52:03.731Z",
        partMatch: {
          create: [
            {
              participantId: list[0].id,
            },
            {
              participantId: list[1].id,
            },
          ],
        },
      },
    });

    prisma.$disconnect();
  }
};
