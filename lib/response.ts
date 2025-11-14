import { NextResponse } from "next/server";

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};
export type ApiErrorResponse = {
  success: false;
  message: string;
  data: null;
};

// Helper function for successful responses
export function formatResponse<T>(
  data: T,
  message = "Operation completed successfully",
  status = 200
) {
  return NextResponse.json<ApiSuccessResponse<T>>(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

// Helper function for error responses
export function formatErrorResponse(
  message = "An error occurred",
  status = 500
) {
  return NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      message,
      data: null,
    },
    { status }
  );
}

export function formatActionErrorResponse(message: string) {
  return {
    message,
    success: false,
    data: null,
  };
}
