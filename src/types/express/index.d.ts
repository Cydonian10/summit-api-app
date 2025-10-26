import { User } from "../../features/auth/user/entity";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
