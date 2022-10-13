import { PrismaClient } from "@prisma/client";
import { eventClose } from "./Middlewares/eventClose";
export const express = require("express");
export const bcrypt = require("bcrypt");
export const jwt = require("jsonwebtoken");
export const cookieParser = require("cookie-parser");
export const crypto = require("crypto");
export const prisma = new PrismaClient();
import cors from "cors";
import userRouter from "./routes/user";
import eventRouter from "./routes/event";
const app = express();
const PORT = process.env.PORT || 3001;

const whiteList = ["https://freeks.onrender.com", "http://localhost:3000"];
const options: cors.CorsOptions = {
  origin: whiteList,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: "GET,POST",
};

prisma.$use(eventClose);
app.use(express.json());
app.use(cookieParser());
app.use(cors(options));
app.use("/api/user", userRouter);
app.use("/api/event", eventRouter);

app.listen(PORT, (err: any) => {
  if (err) {
    console.log(err);
  }
  console.log(`server listening to port : ${PORT}`);
});
