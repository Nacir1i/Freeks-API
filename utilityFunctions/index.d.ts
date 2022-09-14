import { user, event, GAMES } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      event: event;
      user: user;
    }
  }
}
