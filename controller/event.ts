import { GROUP, participants } from "@prisma/client";
import { Request, Response } from "express";
import { prisma, crypto } from "../server";
import { initiateRound } from "../utils/initiateRound";

export const controller = {
  getAllEvents: async (req: Request, res: Response) => {
    try {
      const events = await prisma.event.findMany({
        include: {
          details: true,
        },
      });
      res.status(200).send({ events });
    } catch (err) {
      console.log("getAllEvents : ", err);
      res.status(401).send({ message: "Internal server error" });
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

      const result = event.map((event) => {
        return {
          ...event,
          matches: event.matches.map((partMatch) =>
            partMatch.partMatch.map((participants) => participants.participants)
          ),
        };
      });
      res.status(200).send({ result });
    } catch (err) {
      console.log("getEvent : ", err);
      res.status(401).send({ message: "Internal server error" });
    }
  },
  getParticipants: async (req: Request, res: Response) => {
    const participants: Array<participants> | null =
      await prisma.participants.findMany({
        where: {
          eventId: req.body.partId,
        },
      });

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

      console.log(`event : "${event.id}" has been created`);
      res.status(200).send(event);
    } catch (err) {
      console.log("event create : ", err);
      res.status(500).send({ message: "Internal server error" });
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

    if (!event) {
      res.status(404).send({ message: "Event not found" });
      return;
    } else if (event.full) {
      res.status(403).send({ message: "Event is full" });
      return;
    } else {
      const participant: participants | null =
        await prisma.participants.findFirst({
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

      if (participant) {
        res.status(403).send({ message: "User already joined" });
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

        res.status(200).send({ participant });
        console.log(
          `user : "${req.body.userId}" joined event : "${req.body.eventId}"`
        );
      } catch (err) {
        console.log("join : ", err);
        res.status(401).send({ message: "Internal server error" });
      }
    }
  },
  eliminate: async (req: Request, res: Response) => {
    const participant: participants | null = req.body.participant;
    try {
      const eliminated = await prisma.participants.update({
        where: {
          id: participant?.id,
        },
        data: {
          eliminated: true,
        },
      });

      res.status(200).send(eliminated);
    } catch (err) {
      console.log("eliminate : ", err);
      res.status(401).send({ message: "Internal server error !" });
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

    if (!event) {
      res.status(404).send({ message: "Event not found" });
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
        res.status(200).send({ message: "Final round initiated !" });
      } catch (err) {
        console.log("initiate last match : ", err);
        res.status(401).send({ message: "Internal server error !" });
      }
      return;
    }
    await Promise.all([initiateRound(groupA), initiateRound(groupB)])
      .then(() => {
        res.status(200).send({ message: "Round initiated !" });
      })
      .catch((err) => {
        res.status(401).send({ message: "Internal server error !" });
        console.log("initiate round : ", err);
      });
  },
  deletePart: async (req: Request, res: Response) => {
    const participant: participants | null = req.body.participant;
    try {
      const update = await prisma.participants.delete({
        where: {
          id: participant?.id,
        },
      });

      res.status(200).send(update);
    } catch (err) {
      console.log("deletePart : ", err);
      res.status(500).send({ message: "Internal server error !" });
    }
  },
};
