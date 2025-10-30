import client from "@/src/database/pg-init";
import { Router } from "express";

export class AppRoutes {
  public static routes(): Router {
    const router = Router();

    router.get("/api/health", (_req, res) => {
      res.json({ status: "ok", timestamp: new Date() });
    });

    router.get("/api/users", async (_req, res) => {
      const clientPg = await client.connect();

      const result = await clientPg.query(`
        SELECT 
          id, name, email, password_hash password, roles, date_of_birth dateBirth
        FROM "User"
        `);

      res.json({
        message: "Exitos Rotundos !!!",
        data: result.rows,
      });
    });

    router.post("/api/users", async (req, res) => {
      const { name, email, roles, password, dateBirth } = req.body;
      const clientPg = await client.connect();

      const result = await clientPg.query(
        `
        INSERT INTO "User" (name, email, roles, password_hash, date_of_birth) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, email, roles, password, dateBirth]
      );

      res.json({
        message: "User created successfully",
        data: result.rows[0],
      });
    });

    // router.use("/api/user", UserRouter.routes);
    // router.use("/api/auth", AuthRouter.routes);

    return router;
  }
}
