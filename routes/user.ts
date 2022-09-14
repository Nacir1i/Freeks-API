import { express } from "../server";
import { VerifyUserIdent } from "../Middlewares/verifyUseIdent";
const userRouter = express.Router();
const controller = require("../controller/userController");

userRouter.post("/get", controller.get);
userRouter.post("/create", VerifyUserIdent, controller.create);
userRouter.post("/login", controller.login);

(module.exports = userRouter), express;
