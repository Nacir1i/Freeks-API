import { PrismaClient } from "@prisma/client";
import { eventClose } from "./Middlewares/eventClose";
export const express = require("express");
export const bcrypt = require("bcrypt");
export const jwt = require("jsonwebtoken");
export const cookieParser = require("cookie-parser");
export const crypto = require("crypto");
export const prisma = new PrismaClient();
const cors = require("cors");
import userRouter from "./routes/user";
import eventRouter from "./routes/event";
const app = express();
const PORT = process.env.PORT || 3001;

prisma.$use(eventClose);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/api/user", userRouter);
app.use("/api/event", eventRouter);

app.listen(PORT, (err: any) => {
  if (err) {
    console.log(err);
  }
  console.log(`server listening to port : ${PORT}`);
});
