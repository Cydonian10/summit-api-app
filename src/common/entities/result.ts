import { CustomError } from "./custom-error";

export class Result<T> {
  private readonly success: boolean;
  private readonly value?: T;
  private readonly error?: CustomError;

  private constructor(success: boolean, value?: T, error?: CustomError) {
    this.success = success;
    this.value = value;
    this.error = error;
  }

  // 🎉 Static factory method for success cases
  static success<T>(value?: T): Result<T> {
    return new Result<T>(true, value);
    // Notice: error is undefined in success cases
  }

  // ❌ Static factory method for error cases
  static error<T>(error: CustomError): Result<T> {
    return new Result<T>(false, undefined, error);
    // Notice: value is undefined in error cases
  }

  // 🔍 Type guard methods for checking state
  isSuccess(): boolean {
    return this.success;
  }

  isFailure(): boolean {
    return !this.isSuccess();
  }

  // 📦 Safe value extraction
  getValue(): T | undefined {
    return this.value;
  }

  // 🚨 Safe error extraction
  getError(): CustomError | undefined {
    return this.error;
  }
}
