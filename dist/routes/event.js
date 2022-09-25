"use strict";
exports.__esModule = true;
var server_1 = require("../server");
var event_1 = require("../controller/event");
var authAdmin_1 = require("../Middlewares/authAdmin");
var authUser_1 = require("../Middlewares/authUser");
var checkPart_1 = require("../Middlewares/checkPart");
var eventRouter = server_1.express.Router();
eventRouter.get("/getAllEvents", event_1.controller.getAllEvents);
eventRouter.post("/getEvent", event_1.controller.getEvent);
eventRouter.post("/getParticipants", event_1.controller.getParticipants);
eventRouter.post("/create", authUser_1.authUser, authAdmin_1.authAdmin, event_1.controller.create);
eventRouter.post("/join", authUser_1.authUser, event_1.controller.join);
eventRouter.post("/initiate", authUser_1.authUser, authAdmin_1.authAdmin, event_1.controller.initiate);
eventRouter.post("/delete", authUser_1.authUser, authAdmin_1.authAdmin, checkPart_1.checkPart, event_1.controller.deletePart);
eventRouter.post("/eliminate", authUser_1.authUser, authAdmin_1.authAdmin, checkPart_1.checkPart, event_1.controller.eliminate);
exports["default"] = eventRouter;
//# sourceMappingURL=event.js.map