import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
