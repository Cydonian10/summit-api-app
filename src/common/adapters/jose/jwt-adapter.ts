import { SignJWT, jwtVerify } from "jose";
import { Payload } from "../../entities/payload";
import logger from "@/src/config/logger";

export class JwtAdapter {
  // expiresIn accepts any value supported by jose's setExpirationTime, e.g. '1h', '30m', or a numeric seconds string
  static async generateToken(
    payload: Payload | Record<string, any>,
    expiresIn = "1h"
  ): Promise<string> {
    const tokenBuilder = new SignJWT({ ...payload }).setProtectedHeader({
      alg: "HS256",
    });

    // Apply expiration time if provided
    if (expiresIn) {
      // jose accepts a string like '1h' or numeric seconds
      tokenBuilder.setExpirationTime(expiresIn as any);
    }

    const token = await tokenBuilder.sign(
      new TextEncoder().encode(
        "kasdñfkasjdfñklasdjfñaksdjfñaksdjfñaskdfjñakdfjalksdjf"
      )
    );

    return token;
  }

  static async verifyToken(token: string): Promise<Payload | null> {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(
          "kasdñfkasjdfñklasdjfñaksdjfñaksdjfñaskdfjñakdfjalksdjf"
        )
      );
      return Payload.fromObject(payload);
    } catch (error) {
      return null;
    }
  }
}
