"use strict";
exports.__esModule = true;
var server_1 = require("../server");
var verifyUserIdent_1 = require("../Middlewares/verifyUserIdent");
var user_1 = require("../controller/user");
var userRouter = server_1.express.Router();
userRouter.get("/test", user_1.controller.test);
userRouter.get("/verifyToken", user_1.controller.verifyToken);
userRouter.post("/get", user_1.controller.get);
userRouter.post("/create", verifyUserIdent_1.VerifyUserIdent, user_1.controller.create);
userRouter.post("/login", verifyUserIdent_1.VerifyUserIdent, user_1.controller.login);
exports["default"] = userRouter;
//# sourceMappingURL=user.js.map