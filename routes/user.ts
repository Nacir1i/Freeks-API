import { express } from "../server";
import { VerifyUserIdent } from "../Middlewares/verifyUserIdent";
import { controller } from "../controller/user";
const userRouter = express.Router();

userRouter.get("/test", controller.test);
userRouter.get("/verifyCookieToken", controller.verifyCookieToken);
userRouter.get("/verifyHeaderToken", controller.verifyHeaderToken);
userRouter.post("/get", controller.get);
userRouter.post("/create", VerifyUserIdent, controller.create);
userRouter.post("/login", VerifyUserIdent, controller.login);

export default userRouter;
