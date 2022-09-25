import { Request, Response } from "express";
import { prisma, bcrypt, jwt, crypto } from "../server";
import { user } from "@prisma/client";

export const controller = {
  test: (req: Request, res: Response) => {
    res.send("seems to work !");
  },
  get: async (req: Request, res: Response) => {
    try {
      if (req.body.email == undefined) {
        res.status(401).send({ massage: "Please provide valid data" });
        return;
      }
      const user = await prisma.user.findFirst({
        where: {
          email: req.body.email,
        },
        select: {
          id: true,
          username: true,
          email: true,
          createAt: true,
        },
      });

      if (!user) {
        res.status(404).send({ message: "Account Not Found" });
        return;
      }
      res.status(200).send(user);
    } catch (err) {
      console.log("create : ", err);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
  create: async (req: Request, res: Response) => {
    const testUser = await prisma.user.count({
      where: {
        OR: [{ username: req.body.username }, { email: req.body.email }],
      },
    });

    if (testUser !== 0) {
      res.status(409).send({ message: "Username/Email already taken" });
      return;
    }
    try {
      const salt: string = await bcrypt.genSalt();
      const hashedPassword: string = await bcrypt.hash(req.body.password, salt);
      const data = {
        id: crypto.randomBytes(10).toString("hex"),
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
      };
      const token: string = await jwt.sign(data, process.env.TOKEN);

      const user: user = await prisma.user.create({
        data: data,
      });

      res.status(200).send({ user, token });
    } catch (err) {
      console.log("create : ", err);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
  login: async (req: Request, res: Response) => {
    const user: user | null = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      res.status(404).send({ message: "Account Not Found" });
      return;
    }
    try {
      if (await bcrypt.compare(req.body.password, user.password)) {
        const token = jwt.sign(user, process.env.TOKEN);
        res.cookie("authToken", token);
        res.status(200).send({ user, token });
      } else {
        res.status(401).send({ message: "Wrong Password" });
      }
    } catch (err) {
      console.log("login : ", err);
      res.status(500).send({ message: "Internal server error" });
    }
  },
  verifyToken: async (req: Request, res: Response) => {
    const authToken: string = req.cookies.authToken;
    if (authToken !== "") {
      try {
        await jwt.verify(
          authToken,
          process.env.TOKEN,
          (err: any, user: user) => {
            if (err) {
              res.status(200).send(null);
            } else {
              res.status(200).send(user);
            }
          }
        );
      } catch (err) {
        console.log(err);
        res.status(500).send(null);
      }

      return;
    }
    return res.status(200).send(null);
  },
};
