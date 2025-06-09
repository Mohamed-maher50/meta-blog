import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a given timestamp into a long date string (e.g., "January 1, 2024").
 *
 * @param timeStamp - The timestamp in milliseconds since the Unix epoch to format.
 * @returns A string representing the formatted date in "Month Day, Year" format.
 */
export function longDate(timeStamp: number) {
  const date = new Date(timeStamp);
  return date.toLocaleDateString("en-us", {
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
