import { PrismaClient } from "@prisma/client";
import { eventClose } from "./Middlewares/eventPost";

export const express = require("express");
export const bcrypt = require("bcrypt");
export const jwt = require("jsonwebtoken");
export const crypto = require("crypto");
export const prisma = new PrismaClient();
const cors = require("cors");
const userRouter = require("./routes/user");
const eventRouter = require("./routes/event");
const app = express();

prisma.$use(eventClose);
app.use(express.json());
app.use(cors());
app.use("/user", userRouter);
app.use("/event", eventRouter);

app.listen(3001, (err: any) => {
  if (err) {
    console.log(err);
  }
  console.log("server listening to port 3001");
});
