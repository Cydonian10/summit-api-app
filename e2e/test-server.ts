import { AppRoutes } from "@/src/routes";
import { ServerApp } from "@/src/server";

export const testServer = new ServerApp({
  port: 3000,
  publicPath: "public",
});

testServer.setRoutes(AppRoutes.routes());
