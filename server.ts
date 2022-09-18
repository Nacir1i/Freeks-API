import { PrismaClient } from "@prisma/client";
import { eventClose } from "./middlewares/eventClose";

export const express = require("express");
export const bcrypt = require("bcrypt");
export const jwt = require("jsonwebtoken");
export const cookieParser = require("cookie-parser");
export const crypto = require("crypto");
export const prisma = new PrismaClient();
const cors = require("cors");
const userRouter = require("./routes/user");
const eventRouter = require("./routes/event");
const app = express();
const PORT = process.env.PORT || 3001;

prisma.$use(eventClose);
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/api/user", userRouter);
app.use("/api/event", eventRouter);

app.listen(PORT, (err: any) => {
  if (err) {
    console.log(err);
  }
  console.log("server listening to port 3001");
});
