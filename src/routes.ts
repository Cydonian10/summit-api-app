import { Router } from "express";

export class AppRoutes {
  public static routes(): Router {
    const router = Router();

    router.get("/api/user", (_req, res) => {
      res.json({
        message: "Exitos Rotundos !!!",
      });
    });

    // router.use("/api/user", UserRouter.routes);
    // router.use("/api/auth", AuthRouter.routes);

    return router;
  }
}
