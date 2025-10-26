import { ServerApp } from "./server";
import { AppRoutes } from "./routes";
import dotenv from "dotenv";
dotenv.config();

// una funcion autoinvocada
(async () => {
  const server = new ServerApp({
    port: 3000,
    publicPath: "public",
  });

  server.setRoutes(AppRoutes.routes());

  server.start();
})();
