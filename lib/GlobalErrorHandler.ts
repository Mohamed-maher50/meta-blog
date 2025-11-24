import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(message: string, public status: number) {
    super(message, { cause: status });
    this.message = message;
    this.status = status;
    this.name = AppError.name;
    this.cause = status;
  }
}
type prismaCode = "P2002" | "P2003" | "P2016" | "P2000";
const PrismaDefaultMessages: Record<prismaCode, string> = {
  P2000:
    "Data type/format mismatch: one or more values aren't compatible with the target column — check types, lengths and formats.",
  P2002:
    "Unique constraint failed: an identical record already exists — duplicate value detected.",
  P2003:
    "Foreign key constraint failed: related record not found — ensure referenced data exists before linking.",
  P2016:
    "Query returned no results: the operation expected data but none was found — verify filters and relations.",
};
export function PrismaErrorMessages(
  error: Prisma.PrismaClientKnownRequestError,
  messages?: Record<prismaCode, string>
) {
  if (messages) {
    const message =
      messages[error.code as prismaCode] ||
      PrismaDefaultMessages[error.code as prismaCode] ||
      "Unexpected Error ";
    return message;
  }
  return PrismaDefaultMessages[error.code as prismaCode];
}
export type ApiResponseError = {
  message: string;
  type: string;
  details: { field: string; issue: string }[];
  timestamp: string;
  success: boolean;
};
export function ErrorHandler(
  error: unknown,
  success?: boolean
): [ApiResponseError, { status: number }] {
  success = success ?? true;

  const timestamp = new Date().toISOString();
  if (error instanceof Prisma.PrismaClientKnownRequestError)
    return [
      {
        message: PrismaErrorMessages(error),
        type: "QueryError",
        details: [],
        timestamp,
        success,
      },
      { status: 500 },
    ] as const;
  if (error instanceof ZodError) {
    const details = error.issues.map((err) => ({
      field: `${String(err.path[0])} ${
        (err.path[1] || err.path[1] == 0) && `index: ${String(err.path[1])}`
      } `,
      issue: err.message,
    }));
    return [
      {
        message: ` Invalid input data`,
        type: "ValidationError",
        details,
        timestamp,
        success,
      },
      { status: 422 },
    ] as const;
  }
  if (error instanceof SyntaxError && error.message.includes("JSON")) {
    return [
      {
        message: `Syntax Error : ${error.message}`,
        type: "SyntaxError",
        details: [],
        timestamp,
        success,
      },
      { status: 422 },
    ] as const;
  }
  if (error instanceof AppError) {
    return [
      {
        message: error.message,
        type: "operation",
        details: [],
        timestamp,
        success,
      },
      { status: (error.cause as number) || 500 },
    ] as const;
  }
  return [
    {
      message: `sorry un expected Error`,
      type: "Crash",
      details: [],
      timestamp,
      success,
    },
    { status: 500 },
  ] as const;
}
export function ClientErrorHandler(
  error: Error & AppError,
  success?: boolean
): [ApiResponseError, { status: number }] {
  success = success ?? true;

  const timestamp = new Date().toISOString();

  if (error instanceof ZodError) {
    const details = error.issues.map((err) => ({
      field: `${err.path[0].toString()} ${
        (err.path[1] || err.path[1] == 0) && `index: ${String(err.path[1])}`
      } `,
      issue: err.message,
    }));
    return [
      {
        message: ` Invalid input data`,
        type: "ValidationError",
        details,
        timestamp,
        success,
      },
      { status: 422 },
    ] as const;
  }
  if (error instanceof SyntaxError && error.message.includes("JSON")) {
    return [
      {
        message: `Syntax Error : ${error.message}`,
        type: "SyntaxError",
        details: [],
        timestamp,
        success,
      },
      { status: 422 },
    ] as const;
  }
  if (error.name == AppError.name) {
    return [
      {
        message: error.message,
        type: "operation",
        details: [],
        timestamp,
        success,
      },
      { status: (error.status as number) || 400 },
    ] as const;
  }
  return [
    {
      message: `sorry un expected Error`,
      type: "Server Unhandled",
      details: [],
      timestamp,
      success,
    },
    { status: 500 },
  ] as const;
}
export const UnauthorizedError = new AppError(
  "Hold up! You need to be signed in to access this area — please log in or create an account to continue.",
  401
);
