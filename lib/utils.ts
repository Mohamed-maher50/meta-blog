import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";
import { UploadApiResponse } from "cloudinary";

import { NextRequest } from "next/server";
import { IPagination } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const requiredEnv = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};
/**
 * Formats a given timestamp into a long date string (e.g., "January 1, 2024").
 *
 * @param timeStamp - The timestamp in milliseconds since the Unix epoch to format.
 * @returns A string representing the formatted date in "Month Day, Year" format.
 */
export function longDate(createdAt: string | number | Date) {
  // Ensure it's converted to Date
  const date = new Date(createdAt);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
/**
 * Hashes a plain text password using bcrypt with a configurable number of salt rounds.
 *
 * @param password - The plain text password to be hashed.
 * @returns A promise that resolves to the hashed password as a string.
 *
 * @remarks
 * The number of salt rounds is determined by the `HASH_ROUND` environment variable.
 * Throws an error if `HASH_ROUND` is not defined or not a valid number.
 */
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(+(process.env.HASH_ROUND as string));
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}
/**
 * Verifies whether a plain text password matches a given hashed password using bcrypt.
 *
 * @param password - The plain text password to verify.
 * @param hashed - The bcrypt hashed password to compare against.
 * @returns A promise that resolves to `true` if the password matches the hash, or `false` otherwise.
 */
export async function verifyHashed(password: string, hashed: string) {
  const verificationStatus = await bcrypt.compare(password, hashed);
  return verificationStatus;
}
/**
 * Converts an UploadApiResponse object to a standardized cover format object.
 *
 * @param uploadCoverResult - The response object from the upload API containing cover image details.
 * @returns An object containing the public ID, width, height, format (as "jpg", "png", or "webp"), and the current creation timestamp in ISO format.
 */
export type CoverFormat = {
  public_id: string;
  width: number;
  height: number;
  format: "jpg" | "png" | "webp";
  created_at: string;
  src: string;
};
export const convertToCoverFormat = (
  uploadCoverResult: UploadApiResponse
): CoverFormat => ({
  public_id: uploadCoverResult.public_id,
  width: uploadCoverResult.width,
  height: uploadCoverResult.height,
  format: uploadCoverResult.format.toLowerCase() as "jpg" | "png" | "webp",
  created_at: new Date().toISOString(),
  src: uploadCoverResult.secure_url,
});

export class ExtendingError extends Error {
  constructor(message: string, public name = "Internal Server Error") {
    super(message);
    this.message = message;
    this.name = name;
  }
}
export async function getImageDimensions(
  src: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = src;
  });
}

export async function requireAuth() {
  const session = await auth();

  if (!session) throw UnauthorizedError;
  return session;
}
export const withAuth = (
  cb: (req: NextRequest, token: Session) => Promise<Response>
) => {
  return async (req: NextRequest) => {
    const token = await auth();
    if (!token || !token.user.userId) throw UnauthorizedError;

    return cb(req, token);
  };
};

export function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toString();

  const units = ["", "k", "M", "B", "T"];
  const order = Math.floor(Math.log10(num) / 3);
  const unit = units[order];
  const scaled = num / Math.pow(1000, order);

  return scaled.toFixed(scaled < 10 ? 1 : 0) + unit;
}

export function sort(searchParams: URLSearchParams, fields: string[]) {
  const orderByValues = searchParams.get("sort");
  const splitFields = orderByValues?.split(",") || [];
  return splitFields?.reduce<Record<string, string>>((current, next) => {
    if (!fields.includes(next.replace("-", ""))) return current;
    if (next.startsWith("-")) current[next.slice(1)] = "desc";
    else current[next] = "asc";
    return current;
  }, {});
}

const filtrationQuery = <T extends string[]>(
  searchParams: URLSearchParams,
  availableFields: T
): Partial<Record<T[number], string>> => {
  type FilteredKeys = T[number];
  const keys = Array.from(searchParams.keys());
  const filtration: Partial<Record<T[number], string>> = {};
  keys.forEach((k) => {
    if (availableFields.includes(k as FilteredKeys))
      filtration[k as FilteredKeys] = searchParams.get(k) as string;
  });
  return filtration;
};
export class ApiFuturesQuery {
  public Query: {
    where: Record<string, unknown>;
    orderBy: Record<string, unknown>[];
    omit: Record<string, unknown>;
    skip: number;
    take: number;
    include: Record<string, unknown>;
  } = {
    where: {},
    orderBy: [{ id: "asc" }],
    omit: {},
    skip: 0,
    take: 0,
    include: {},
  };
  private request: NextRequest;
  constructor(route: NextRequest) {
    this.request = route;
  }
  omit(extraFields?: string[]) {
    const omittedFields: string | null =
      this.request.nextUrl.searchParams.get("omit");
    let splitFields = omittedFields?.split(",");
    splitFields = splitFields?.concat(extraFields || []);
    if (!splitFields || splitFields.length <= 0) return this;
    const extractedFields = splitFields.reduce<Record<string, boolean>>(
      (store, c) => {
        if (!c) return store;
        store[c] = true;
        return store;
      },
      {}
    );
    this.Query.omit = { ...this.Query.omit, ...extractedFields };
    return this;
  }
  sortAppend(cb: (s: URLSearchParams) => Record<string, unknown>[]) {
    const object = cb(this.request.nextUrl.searchParams);

    this.Query.orderBy = [...object, ...this.Query.orderBy];
    return this;
  }
  sort(fields: string[]) {
    const sortedFields = sort(this.request.nextUrl.searchParams, fields);
    this.Query.orderBy = [
      ...this.Query.orderBy,
      ...Object.entries(sortedFields).map(([key, value]) => ({ [key]: value })),
    ];
    return this;
  }
  paginateQuery() {
    this.Query.take = pagination(this.request.nextUrl.searchParams).take;
    this.Query.skip = pagination(this.request.nextUrl.searchParams).skip;
    return this;
  }
  paginate(totalDocs: number): IPagination {
    const limit = +(this.request.nextUrl.searchParams.get("limit") || "10");
    const page = +(this.request.nextUrl.searchParams.get("page") || "1");
    if (limit <= 0) throw new Error("`take` must be greater than 0");
    this.Query.take = limit;
    this.Query.skip = (page - 1) * limit;
    const totalPages = Math.ceil(totalDocs / limit) || 1;
    return {
      totalItems: totalDocs,
      page,
      totalPages,
      hasNextPage: page < totalPages ? page + 1 : null,
      hasPrevPage: page > 1 ? page - 1 : null,
    };
  }
  search(options?: SearchOptions) {
    const { label = "title", mode = "insensitive" } = options || {};
    const searchValue = this.request.nextUrl.searchParams.get("q") || null;

    if (!searchValue) return this;
    const SearchResult = {
      [label]: {
        contains: this.request.nextUrl.searchParams.get("q") || null,
        mode,
      },
    };
    this.Query.where = { ...this.Query.where, ...SearchResult };
    return this;
  }
  filter(
    fields: string[],
    nested?: ({ searchParams }: { searchParams: URLSearchParams }) => unknown
  ) {
    const filterResult = filtrationQuery<typeof fields>(
      this.request.nextUrl.searchParams,
      fields
    );
    const extractNested =
      nested && nested({ searchParams: this.request.nextUrl.searchParams });
    this.Query.where = {
      ...this.Query.where,
      ...filterResult,
      ...(extractNested ? extractNested : {}),
    };
    return this;
  }
}
interface SearchOptions {
  label?: string;
  mode?: "default" | "insensitive";
}
export const wait = async (time?: number): Promise<boolean> => {
  return new Promise((resolve) => setTimeout(() => resolve(true), time || 500));
};
export const wordsNumber = (words: string) => words.trim().split(/\s+/).length;
export const getReadTime = (words: string | number) => {
  if (typeof words === "string") {
    const wordCount = words.length == 0 ? 0 : wordsNumber(words);
    const readTime = Math.ceil(wordCount / 200);
    return readTime;
  }
  const readTime = Math.ceil(words / 200);
  return readTime;
};
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { UnauthorizedError } from "./GlobalErrorHandler";
import { auth } from "@/auth";
import { Session } from "next-auth";

/**
 * Extracts only the dirty fields and their current values from a React Hook Form instance.
 */
export function getDirtyValues<T extends FieldValues>(
  form: UseFormReturn<T>
): Partial<T> {
  const dirtyFields = form.formState.dirtyFields;

  return (Object.keys(dirtyFields) as Path<T>[]).reduce((acc, key) => {
    acc[key] = form.getValues(key);
    return acc;
  }, {} as Partial<T>);
}
const pagination = (searchParams: URLSearchParams) => {
  const page = +(searchParams.get("page") || "1");
  const limit = searchParams.get("limit") || "10";
  const skip = (page - 1) * +limit;
  return {
    skip,
    take: parseInt(limit),
  };
};
