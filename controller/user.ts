import { Request, Response } from "express";
import { prisma, bcrypt, jwt, crypto } from "../server";
import { user } from "@prisma/client";

export const controller = {
  test: (req: Request, res: Response) => {
    res.send("seems to work !");
  },
  get: async (req: Request, res: Response) => {
    try {
      const user: user | null = await prisma.user.findFirst({
        where: {
          email: req.body.email,
        },
      });

      if (!user) {
        res.status(404).send();
        return;
      }
      res.status(200).send(user);
    } catch (err) {
      console.log("create : ", err);
      res.status(500).send();
    }
  },
  create: async (req: Request, res: Response) => {
    const testUser = await prisma.user.count({
      where: {
        OR: [{ username: req.body.username }, { email: req.body.email }],
      },
    });

    if (testUser !== 0) {
      res.status(409).send();
      return;
    }
    try {
      const salt: string = await bcrypt.genSalt();
      const hashedPassword: string = await bcrypt.hash(req.body.password, salt);
      const user = {
        id: crypto.randomBytes(10).toString("hex"),
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
      };
      const token: string = await jwt.sign(user, process.env.TOKEN);

      await prisma.user.create({
        data: user,
      });

      res.status(200).send(token);
    } catch (err) {
      console.log("create : ", err);
      res.status(500).send();
    }
  },
  login: async (req: Request, res: Response) => {
    const user: user | null = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      res.status(404).send();
      return;
    }
    try {
      if (await bcrypt.compare(req.body.password, user.password)) {
        const token = jwt.sign(user, process.env.TOKEN);
        res.cookie("authToken", token);
        res.status(200).send({ token });
      } else {
        res.status(401).send();
      }
    } catch (err) {
      console.log("login : ", err);
      res.status(500).send();
    }
  },
};
