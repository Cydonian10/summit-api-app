import { envs } from "@/src/config/envs";

import { Pool, PoolConfig } from "pg";

const config: PoolConfig = {
  host: envs.POSTGRES_HOST || "localhost",
  port: envs.POSTGRES_PORT || 5432,
  user: envs.POSTGRES_USER || "postgres",
  password: envs.POSTGRES_PASSWORD || "",
  database: envs.POSTGRES_DB_NAME || "postgres",
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: false,
};

const pool = new Pool(config);

export async function initPg(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
  } finally {
    client.release();
  }
}

export async function closePg(): Promise<void> {
  await pool.end();
}

export default pool;
