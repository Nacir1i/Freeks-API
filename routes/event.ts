import { express } from "../server";
import { controller } from "../controller/event";
import { authAdmin } from "../middlewares/authAdmin";
import { authUser } from "../middlewares/authUser";
import { checkPart } from "../middlewares/checkPart";

const eventRouter = express.Router();

eventRouter.get("/getAllEvents", controller.getAllEvents);
eventRouter.post("/getEvent", controller.getEvent);
eventRouter.post("/getParticipants", controller.getParticipants);
eventRouter.post("/create", authUser, authAdmin, controller.create);
eventRouter.post("/join", authUser, controller.join);
eventRouter.post("/initiate", authUser, authAdmin, controller.initiate);
eventRouter.post(
  "/delete",
  authUser,
  authAdmin,
  checkPart,
  controller.deletePart
);
eventRouter.post(
  "/eliminate",
  authUser,
  authAdmin,
  checkPart,
  controller.eliminate
);

module.exports = eventRouter;
