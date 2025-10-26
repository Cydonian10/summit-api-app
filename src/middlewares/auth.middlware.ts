import { JwtAdapter } from "@/src/common/adapters/jose/jwt-adapter";
import { Request, Response, NextFunction } from "express";
import { User } from "../features/auth/user/entity";
import { UserService } from "../features/auth/user/service";

export class AuthMiddleware {
  static isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userSrv = new UserService();

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const payload = await JwtAdapter.verifyToken(token);
    if (!payload) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const result = await userSrv.getUserByEmail(payload.email);

    if (!result.isSuccess()) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const userEntity = result.getValue();
    req.user = userEntity;
    next();
  };
}
