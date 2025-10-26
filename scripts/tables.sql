-- CREATE TYPE  user_role AS ENUM ('admin', 'user', 'docente','estudiante','evaluador');

CREATE TABLE IF NOT EXISTS  "User" (
    id SERIAL PRIMARY KEY,
    "name" VARCHAR(50) UNIQUE NOT NULL,
    "email" VARCHAR(100) UNIQUE NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "roles" TEXT[] NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "date_of_birth" DATE
);

TRUNCATE TABLE "User" RESTART IDENTITY;
DROP TABLE "User";


SELECT * from "User";