import { Request, Response } from "express";
import { AuthService } from "./service";
import { validateBody } from "@/src/utils/validation/requestValidation";
import { handleResult } from "@/src/utils/http/handleResult";
import { LoginDtoSchema } from "./dtos/login-dto";

export class AuthController {
  constructor(private authSrv: AuthService) {}

  loginUser = async (req: Request, res: Response) => {
    const parsedBody = validateBody(req, res, LoginDtoSchema);
    if (!parsedBody.success) return;

    const result = await this.authSrv.loginUser(parsedBody.data);

    return handleResult(res, result, "Login successful");
  };

  profile = async (req: Request, res: Response) => {
    const user = req.user!;

    return res.status(200).json({ success: true, data: user });
  };
}
