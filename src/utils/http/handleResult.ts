import { Response } from "express";
import { Result } from "@/src/common/entities/result";
import logger from "../../config/logger";

/**
 * Maneja la respuesta HTTP basada en un Result
 *
 * Convención de respuestas:
 * - Success: { message: string, data?: T }
 * - Error: { message: string }
 *
 * @param res - Response de Express
 * @param result - Resultado de la operación
 * @param successMessage - Mensaje para caso de éxito (opcional)
 * @param statusCode - Status code personalizado (opcional, default: 200 para success, error.statusCode para error)
 */
export function handleResult<T>(
  res: Response,
  result: Result<T>,
  successMessage = "Success",
  statusCode?: number
): Response {
  if (result.isSuccess()) {
    const value = result.getValue();
    // logger.info({ value }, "Operation successful");
    const status = statusCode ?? 200;

    if (value === undefined || value === null) {
      return res.status(status).json({ message: successMessage });
    }

    return res.status(status).json({
      message: successMessage,
      data: value,
    });
  }

  // Caso de error
  const error = result.getError();
  if (!error) {
    return res.status(500).json({ message: "Unknown error occurred" });
  }

  const status = error.statusCode ?? statusCode;
  return res.status(status).json({ message: error.message });
}

/**
 * Maneja un error directo (cuando no usas Result)
 *
 * @param res - Response de Express
 * @param error - Error a manejar
 * @param statusCode - Status code (opcional, default: error.statusCode o 500)
 */
export function handleError(
  res: Response,
  error: Error | any,
  statusCode?: number
): Response {
  const status = statusCode ?? error.statusCode ?? 500;
  const message = error.message ?? "Internal server error";

  return res.status(status).json({ message });
}

/**
 * Maneja una respuesta de éxito directo (cuando no usas Result)
 *
 * @param res - Response de Express
 * @param message - Mensaje de éxito
 * @param data - Datos a enviar (opcional)
 * @param statusCode - Status code (opcional, default: 200)
 */
export function handleSuccess<T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200
): Response {
  if (data === undefined || data === null) {
    return res.status(statusCode).json({ message });
  }

  return res.status(statusCode).json({ message, data });
}
