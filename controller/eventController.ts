import { GROUP, participants } from "@prisma/client";
import { Request, Response } from "express";
import { prisma, crypto } from "../server";
import { initiateRound } from "../utilityFunctions/initiateRound";

module.exports = {
  getAllEvents: async (req: Request, res: Response) => {
    try {
      const events = await prisma.event.findMany({
        include: {
          details: true,
        },
      });
      res.status(200).send({ message: "events required !", events });
    } catch (err) {
      console.log(err);
      res.status(401).send({ message: "internal error" });
    }
  },
  getEvent: async (req: Request, res: Response) => {
    try {
      const event = await prisma.event.findMany({
        where: {
          id: req.body.eventId,
        },
        include: {
          details: true,
          participants: {
            include: {
              user: {
                select: {
                  username: true,
                  email: true,
                },
              },
            },
          },
          matches: {
            include: {
              partMatch: {
                include: {
                  participants: {
                    include: {
                      user: {
                        select: {
                          username: true,
                          email: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      prisma.$disconnect();
      const result = await event.map((event) => {
        return {
          ...event,
          matches: event.matches.map((partMatch) =>
            partMatch.partMatch.map((participants) => participants.participants)
          ),
        };
      });
      res.status(200).send({ message: "event found", result });
    } catch (err) {
      console.log(err);
      res.status(401).send({ message: "internal error" });
    }
  },
  getParticipants: async (req: Request, res: Response) => {
    const participants: Array<participants> | null =
      await prisma.participants.findMany({
        where: {
          eventId: req.body.partId,
        },
      });
    prisma.$disconnect();

    res.status(200).send(participants);
  },
  create: async (req: Request, res: Response) => {
    try {
      const event = await prisma.event.create({
        data: {
          id: crypto.randomBytes(10).toString("hex"),
          name: req.body.name,
          details: {
            create: {
              maxplayers: req.body.maxPlayers,
              startsIn: req.body.start,
              endsIn: req.body.end,
            },
          },
        },
      });
      prisma.$disconnect();
      res.status(200).send({ message: "event created", event });
      console.log(`event : "${req.body.eventName}" has been created`);
    } catch (err) {
      console.log(err);
      res.status(401).send({ message: "internal error" });
    }
  },
  join: async (req: Request, res: Response) => {
    const event = await prisma.event.findFirst({
      where: {
        id: req.body.eventId,
      },
      include: {
        details: true,
        participants: true,
      },
    });
    prisma.$disconnect();
    if (!event) {
      res.status(404).send({ message: "not found" });
      return;
    } else if (event.full) {
      res.status(403).send({ message: "event is full" });
      return;
    } else {
      const test: participants | null = await prisma.participants.findFirst({
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
      if (test) {
        res.status(403).send({ message: "user already joined !" });
        return;
      }
      try {
        const groupACount: number = event.participants.filter(
          (participant: participants) => participant.group === GROUP.A
        ).length;
        const maxplayers: number = event.details[0].maxplayers;

        const participant = await prisma.participants.create({
          data: {
            eventId: req.body.eventId,
            userId: req.body.userId,
            eliminated: false,
            group: maxplayers / 2 > groupACount ? GROUP.A : GROUP.B,
          },
        });
        prisma.$disconnect();

        res.status(200).send({ message: "user joined", participant });
        console.log(
          `user : "${req.body.userId}" joined event : "${req.body.eventId}"`
        );
      } catch (err) {
        console.log(err);
        res.status(401).send({ message: "internal error" });
      }
    }
  },
  eliminate: async (req: Request, res: Response) => {
    const part: participants | null = await prisma.participants.findFirst({
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
    if (!part) {
      res.status(404).send({ message: "user not found !" });
      return;
    }

    try {
      const test = await prisma.participants.update({
        where: {
          id: part.id,
        },
        data: {
          eliminated: true,
        },
      });

      res.status(200).send({ message: "user eliminated" });
    } catch (error) {
      res.status(401).send({ message: "internal error !" });
    }
  },
  initiate: async (req: Request, res: Response) => {
    const event = await prisma.event.findFirst({
      where: {
        id: req.body.eventId,
      },
      include: {
        details: true,
        participants: {
          where: {
            eliminated: false,
          },
        },
      },
    });
    prisma.$disconnect();
    if (!event) {
      res.status(404).send({ message: "not found" });
      return;
    }

    const groupA: Array<participants> = event.participants.filter(
      (participant: participants) => participant.group === GROUP.A
    );
    const groupB: Array<participants> = event.participants.filter(
      (participant: participants) => participant.group === GROUP.B
    );

    if (groupA.length === 1 && groupB.length === 1) {
      try {
        await initiateRound([groupA[0], groupB[0]]);
        res.status(200).send({ message: "final round initiated !" });
      } catch (err) {
        res.status(401).send({ message: "internal error !" });
        console.log(err);
      }
      return;
    }
    await Promise.all([initiateRound(groupA), initiateRound(groupB)])
      .then(() => {
        res.status(200).send({ message: "round initiated !" });
      })
      .catch((err) => {
        res.status(401).send({ message: "internal error !" });
        console.log(err);
      });
  },
  deletePart: async (req: Request, res: Response) => {
    const test: participants | null = await prisma.participants.findFirst({
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
    if (!test) {
      res.status(404).send({ message: "user not found !" });
      return;
    }
    prisma.$disconnect();

    try {
      await prisma.participants.delete({
        where: {
          id: test.id,
        },
      });
      prisma.$disconnect();

      res.status(200).send({ message: "participant deleted !" });
    } catch (error) {
      console.log(error);
      res.status(401).send({ message: "internal error !" });
    }
  },
};
