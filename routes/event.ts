import { express } from "../server";
import { controller } from "../controller/event";
import { authAdmin } from "../middlewares/authAdmin";
import { authUser } from "../middlewares/authUser";

const eventRouter = express.Router();

eventRouter.get("/getAllEvents", controller.getAllEvents);
eventRouter.post("/getEvent", controller.getEvent);
eventRouter.post("/getParticipants", controller.getParticipants);
eventRouter.post("/create", authAdmin, controller.create);
eventRouter.post("/join", authUser, controller.join);
eventRouter.post("/delete", authAdmin, controller.deletePart);
eventRouter.post("/eliminate", authAdmin, controller.eliminate);
eventRouter.post("/initiate", authAdmin, controller.initiate);

module.exports = eventRouter;
