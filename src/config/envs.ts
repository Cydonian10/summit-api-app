import "dotenv/config";
import env from "env-var";

export const envs = {
  PORT: env.get("PORT").default("3000").asPortNumber(),
  NODE_ENV: env.get("NODE_ENV").default("dev").asString(),

  //POSTGRES
  POSTGRES_HOST: env.get("POSTGRES_HOST").required().asString(),
  POSTGRES_USER: env.get("POSTGRES_USER").required().asString(),
  POSTGRES_PORT: env.get("POSTGRES_PORT").default("5432").asPortNumber(),
  POSTGRES_PASSWORD: env.get("POSTGRES_PASSWORD").required().asString(),
  POSTGRES_DB_NAME: env.get("POSTGRES_DB_NAME").required().asString(),
  POSTGRES_URL: env.get("POSTGRES_URL").required().asString(),

  //JWT
  JWT_SECRET: env.get("JWT_SECRET").required().asString(),
};
