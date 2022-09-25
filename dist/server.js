"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.prisma = exports.crypto = exports.cookieParser = exports.jwt = exports.bcrypt = exports.express = void 0;
var client_1 = require("@prisma/client");
var eventClose_1 = require("./Middlewares/eventClose");
exports.express = require("express");
exports.bcrypt = require("bcrypt");
exports.jwt = require("jsonwebtoken");
exports.cookieParser = require("cookie-parser");
exports.crypto = require("crypto");
exports.prisma = new client_1.PrismaClient();
var cors = require("cors");
var user_1 = __importDefault(require("./routes/user"));
var event_1 = __importDefault(require("./routes/event"));
var app = (0, exports.express)();
var PORT = process.env.PORT || 3001;
exports.prisma.$use(eventClose_1.eventClose);
app.use(exports.express.json());
app.use((0, exports.cookieParser)());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use("/api/user", user_1["default"]);
app.use("/api/event", event_1["default"]);
app.listen(PORT, function (err) {
    if (err) {
        console.log(err);
    }
    console.log("server listening to port : ".concat(PORT));
});
//# sourceMappingURL=server.js.map