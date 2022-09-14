import { Request, Response } from "express";
import { prisma, bcrypt, jwt, crypto } from "../server";
import { user } from "@prisma/client";

module.exports = {
  get: async (req: Request, res: Response) => {
    const user: user | null = await prisma.user.findFirst({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      res.status(404).send("user not found");
      return;
    }
    res.status(200).send(user);
  },
  create: async (req: Request, res: Response) => {
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
      prisma.$disconnect();

      res.status(200).send({ message: "account created successfully", token });
    } catch (err) {
      res.status(401).send({ message: "internal err" });
      console.log(err);
    }
  },
  login: async (req: Request, res: Response) => {
    if (Object.keys(req.body).length === 0) {
      res.status(404).send({ message: "no data was recieved" });
      return;
    } else if (req.body.password === "") {
      res.status(404).send({ message: "password was not provided" });
      return;
    } else if (req.body.email === "") {
      res.status(404).send({ message: "email was not provided" });
      return;
    }

    const user: user | null = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });
    prisma.$disconnect();
    if (!user) {
      res.status(404).send({ message: "email was not found" });
      return;
    }
    try {
      if (await bcrypt.compare(req.body.password, user.password)) {
        const token = jwt.sign(user, process.env.TOKEN);
        res.status(200).send({ message: "successfully loged in", token });
      } else {
        res.status(401).send({ message: "wrong password" });
      }
    } catch (err) {
      console.log(err);
      res.status(401).send({ message: "internal err" });
    }
  },
};
