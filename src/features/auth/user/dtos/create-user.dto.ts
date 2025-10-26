import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().max(100),
  password: z.string().min(6).max(100),
  roles: z.array(
    z.enum(["admin", "user", "docente", "estudiante", "evaluador"])
  ),
  dateBirth: z.string(), // ISO date string
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
