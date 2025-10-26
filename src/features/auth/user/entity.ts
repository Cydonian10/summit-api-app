export enum Role {
  ADMIN = "admin",
  USER = "user",
  DOCENTE = "docente",
  ESTUDIANTE = "estudiante",
  EVALUADOR = "evaluador",
}

export class User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public roles: Role[] = [],
    public dateBirth?: Date
  ) {}

  public static fromEntity(object: Record<string, any>): User {
    const { id, name, email, roles, dateBirth } = object;

    // Prefer password_hash if password is not present

    // Prefer date_of_birth if dateBirth is not present
    const userDateBirth = dateBirth;
    const parsedDateBirth = userDateBirth ? new Date(userDateBirth) : undefined;

    return new User(
      Number(id),
      String(name),
      String(email),
      roles,
      parsedDateBirth
    );
  }
}

export class UserWithPassword {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public password: string,
    public roles: Role[] = [],
    public dateBirth?: Date
  ) {}

  public static fromEntity(object: Record<string, any>): UserWithPassword {
    const { id, name, email, password, roles, dateBirth } = object;

    // Prefer date_of_birth if dateBirth is not present
    const userDateBirth = dateBirth;
    const parsedDateBirth = userDateBirth ? new Date(userDateBirth) : undefined;

    return new UserWithPassword(
      Number(id),
      String(name),
      String(email),
      String(password),
      roles,
      parsedDateBirth
    );
  }
}
