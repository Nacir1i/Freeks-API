import { express } from "../server";
const eventRouter = express.Router();
const eventController = require("../controller/eventController");

eventRouter.get("/getAllEvents", eventController.getAllEvents);
eventRouter.post("/getEvent", eventController.getEvent);
eventRouter.post("/getParticipants", eventController.getParticipants);
eventRouter.post("/create", eventController.create);
eventRouter.post("/join", eventController.join);
eventRouter.post("/delete", eventController.deletePart);
eventRouter.post("/eliminate", eventController.eliminate);
eventRouter.post("/initiate", eventController.initiate);

module.exports = eventRouter;
