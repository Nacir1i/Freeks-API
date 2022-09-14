import { user, event, participants } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      event: event;
      user: user;
      participant: participants;
    }
  }
}
