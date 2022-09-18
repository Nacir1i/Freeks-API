import { prisma } from "../server";
import { participants } from "@prisma/client";

export const eventClose = async (param: any, next: any) => {
  const query = await next(param);
  if (param.model == "participants") {
    if (param.action == "create") {
      const event = await prisma.event.findUnique({
        where: {
          id: param.args.data.eventId,
        },
        include: {
          details: true,
        },
      });

      const eventPlayers: Array<participants> =
        await prisma.participants.findMany({
          where: {
            eventId: param.args.data.id,
          },
          orderBy: {
            group: "asc",
          },
        });
      prisma.$disconnect();

      if (eventPlayers.length === event?.details[0].maxplayers) {
        await prisma.event.update({
          where: {
            id: event?.id,
          },
          data: {
            full: true,
          },
        });
        prisma.$disconnect();

        console.log(`event : ${event?.id} is full`);
      }
    }
  }

  return query;
};
