import { Request, Response } from "express";
import { handleResult } from "@/src/utils/http/handleResult";
import { NumberSchema } from "@/src/common/validations/number-schema";
import {
  validateParam,
  validateBody,
} from "@/src/utils/validation/requestValidation";
import { CreateUserSchema } from "./dtos/create-user.dto";
import { UpdateUserSchema } from "./dtos/update-user.dto";
import { UserService } from "./service";

export class UserController {
  constructor(private readonly userService: UserService) {}

  createUser = async (req: Request, res: Response) => {
    const parsedBody = validateBody(req, res, CreateUserSchema);
    if (!parsedBody.success) return;

    const result = await this.userService.createUser(parsedBody.data);

    return handleResult(res, result, "User created successfully", 201);
  };

  getAllUsers = async (_req: Request, res: Response) => {
    const result = await this.userService.getAllUsers();
    return handleResult(res, result, "Users retrieved successfully");
  };

  getUserById = async (req: Request, res: Response) => {
    const parsedParam = validateParam(req, res, "id", NumberSchema);
    if (!parsedParam.success) return;

    const result = await this.userService.getUserById(parsedParam.data);
    return handleResult(res, result, "User retrieved successfully");
  };

  updatedUser = async (req: Request, res: Response) => {
    const parsedParam = validateParam(req, res, "id", NumberSchema);
    if (!parsedParam.success) return;

    const parsedBody = validateBody(req, res, UpdateUserSchema);
    if (!parsedBody.success) return;

    const result = await this.userService.updateUser(
      parsedParam.data,
      parsedBody.data
    );

    return handleResult(res, result, "User updated successfully");
  };

  deleteUser = async (req: Request, res: Response) => {
    const parsedParam = validateParam(req, res, "id", NumberSchema);
    if (!parsedParam.success) return;

    const result = await this.userService.deleteUser(parsedParam.data);
    return handleResult(res, result, "User deleted successfully");
  };
}
