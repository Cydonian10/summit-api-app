import { PgResult } from "@/src/config/constans";
import { LoginDto } from "./dtos/login-dto";
import client from "@/src/database/pg-init";
import { UserWithPassword } from "../user/entity";
import { Result } from "@/src/common/entities/result";
import { CustomError } from "@/src/common/entities/custom-error";
import { BcryptAdapter } from "@/src/common/adapters/bcrypt/bcrypt-adapter";
import { PoolClient } from "pg";
import { JwtAdapter } from "@/src/common/adapters/jose/jwt-adapter";
import { Payload } from "@/src/common/entities/payload";

export class AuthService {
  private client: PoolClient | null = null;

  loginUser = async (dto: LoginDto): Promise<Result<{ token: string }>> => {
    this.client = await client.connect();

    const { rows } = await this.client.query<PgResult>(
      `
      SELECT 
        id,
        name, 
        email, roles, password_hash as password, date_of_birth as dataBirth FROM "User"
      WHERE email = $1;
    `,
      [dto.email]
    );

    if (rows.length === 0) {
      return Result.error(
        CustomError.unauthorized("Invalid email or password")
      );
    }

    const user = UserWithPassword.fromEntity(rows[0]);

    const isMatchPassword = BcryptAdapter.compare(dto.password, user.password);
    if (!isMatchPassword) {
      return Result.error(
        CustomError.unauthorized("Invalid email or password")
      );
    }

    const token = await this.generateToken(
      Payload.fromObject({ email: user.email })
    );

    return Result.success({ token: token });
  };

  private generateToken = async (payload: Payload): Promise<string> => {
    const token = await JwtAdapter.generateToken(payload);
    return token;
  };
}
