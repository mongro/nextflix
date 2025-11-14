import { ZodError, z } from "zod";
import { formatActionErrorResponse, formatErrorResponse } from "./response";

// Handles different error types
export function routeErrorHandler(error: unknown) {
  console.log(error);
  if (error instanceof ZodError) {
    // Handling Zod validation errors
    const validationErrors = z.prettifyError(error);
    return formatErrorResponse(validationErrors, 422);
  } else if (error instanceof Error) {
    // Handling generic errors
    return formatErrorResponse(error.message, 500);
  } else {
    // Handling unknown errors
    return formatErrorResponse("An unknown error occurred", 500);
  }
}
export function actionErrorHandler(error: unknown) {
  if (error instanceof ZodError) {
    // Handling Zod validation errors
    const validationErrors = z.prettifyError(error);
    return formatActionErrorResponse(validationErrors);
  } else if (error instanceof Error) {
    // Handling generic errors
    return formatActionErrorResponse(error.message);
  } else {
    // Handling unknown errors
    return formatActionErrorResponse("An unknown error occurred");
  }
}
