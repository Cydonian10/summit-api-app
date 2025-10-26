import { PoolClient } from "pg";

import client from "@/src/database/pg-init";
import logger from "@/src/config/logger";
import { PgResult } from "@/src/config/constans";
import { Result } from "@/src/common/entities/result";
import { CustomError } from "@/src/common/entities/custom-error";
import { User } from "./entity";
import { CreateUserDTO } from "./dtos/create-user.dto";
import { UpdateUserDTO } from "./dtos/update-user.dto";
import { BcryptAdapter } from "@/src/common/adapters/bcrypt/bcrypt-adapter";

export class UserService {
  private client: PoolClient | null = null;

  async createUser(dto: CreateUserDTO): Promise<Result<User>> {
    this.client = await client.connect();

    const passwordHash = BcryptAdapter.hash(dto.password);

    const { rows } = await this.client.query<PgResult>(
      `
      INSERT INTO "User" (name, email, password_hash, roles, date_of_birth)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `,
      [dto.name, dto.email, passwordHash, dto.roles, dto.dateBirth]
    );

    logger.info({ rows }, "Inserted user into database");

    if (rows.length === 0) {
      return Result.error(
        CustomError.internalServerError("Failed to create user")
      );
    }

    return Result.success(User.fromEntity(rows[0]));
  }

  async getAllUsers(): Promise<Result<User[]>> {
    this.client = await client.connect();
    const { rows } = await this.client.query<PgResult>(
      `
      SELECT 
        id,
        name, 
        email, roles, password_hash as password, date_of_birth as dataBirth FROM "User";
    `
    );

    const users = rows.map((row) => User.fromEntity(row));
    return Result.success(users);
  }

  async getUserByEmail(email: string): Promise<Result<User>> {
    this.client = await client.connect();
    const { rows } = await this.client.query<PgResult>(
      `
      SELECT 
        id, name, email, roles, password_hash as password, date_of_birth as dateBirth 
      FROM "User" 
      WHERE email = $1;
    `,
      [email]
    );

    if (rows.length === 0) {
      return Result.error(CustomError.notFound("User not found"));
    }

    return Result.success(User.fromEntity(rows[0]));
  }

  async getUserById(id: number): Promise<Result<User>> {
    this.client = await client.connect();
    const { rows } = await this.client.query<PgResult>(
      `
      SELECT 
        id, name, email, roles, password_hash as password, date_of_birth as dateBirth 
      FROM "User" 
      WHERE id = $1;
    `,
      [id]
    );

    if (rows.length === 0) {
      return Result.error(CustomError.notFound("User not found"));
    }

    return Result.success(User.fromEntity(rows[0]));
  }

  async updateUser(id: number, dto: UpdateUserDTO): Promise<Result<User>> {
    this.client = await client.connect();
    const { rows } = await this.client.query<PgResult>(
      `
      UPDATE "User"
      SET name = COALESCE($1, name),
          email = COALESCE($2, email),
          password_hash = COALESCE($3, password_hash),
          roles = COALESCE($4, roles),
          date_of_birth = COALESCE($5, date_of_birth)
      WHERE id = $6
      RETURNING *;
    `,
      [dto.name, dto.email, dto.password, dto.roles, dto.dateBirth, id]
    );
    if (rows.length === 0) {
      return Result.error(CustomError.notFound("User not found"));
    }

    return Result.success(User.fromEntity(rows[0]));
  }

  async deleteUser(id: number): Promise<Result<number>> {
    this.client = await client.connect();
    const { rowCount } = await this.client.query(
      `
      DELETE FROM "User" WHERE id = $1;
    `,
      [id]
    );

    if (rowCount === 0) {
      return Result.error(CustomError.notFound("User not found"));
    }

    return Result.success(id);
  }
}
