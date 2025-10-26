import { Router } from "express";
import { UserController } from "./controller";
import { UserService } from "./service";

export class UserRouter {
  public static get routes(): Router {
    const router = Router();
    const userService = new UserService();
    const userController = new UserController(userService);
    router.post("/", userController.createUser);
    router.get("/", userController.getAllUsers);
    router.get("/:id", userController.getUserById);
    router.put("/:id", userController.updatedUser);
    router.delete("/:id", userController.deleteUser);
    return router;
  }
}
