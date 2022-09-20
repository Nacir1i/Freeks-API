import { express } from "../server";
import { VerifyUserIdent } from "../Middlewares/verifyUserIdent";
import { controller } from "../controller/user";
const userRouter = express.Router();

userRouter.get("/test", controller.test);
userRouter.post("/get", controller.get);
userRouter.post("/create", VerifyUserIdent, controller.create);
userRouter.post("/login", VerifyUserIdent, controller.login);

module.exports = userRouter;
