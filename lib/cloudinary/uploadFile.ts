import cloudinary from "./cloudinary";
import { UploadApiOptions, UploadApiResponse } from "cloudinary";

/**
 * Uploads a file to Cloudinary using a stream, with optional transformation and callback support.
 *
 * This function converts a browser `File` object to a buffer and uploads it to Cloudinary,
 * applying any specified transformation options. It supports both promise-based and callback-based
 * usage patterns.
 *
 * @param File - The browser `File` object to upload.
 * @param options - (Optional) Additional Cloudinary upload options and transformation parameters.
 *                  These options are merged with default avatar image transformations.
 * @returns A promise that resolves with the Cloudinary upload response (`UploadApiResponse`)
 *          or rejects with an error (`UploadApiErrorResponse`). If a callback is provided,
 *          the promise will resolve/reject based on the callback's outcome.
 *
 * @remarks
 * - The function uses `Buffer.from(await File.arrayBuffer())` to convert the file for upload.
 * @example
 * ```typescript
 * // Using Promise
 * const response = await UploadFile(file, { folder: "avatars" });
 *
 * // Using Callback
 * UploadFile(file, { folder: "avatars" }, (err, res) => {
 *   if (err) { /* handle error *\/ }
 *   else { /* handle success *\/ }
 * });
 * ```
 */

export const UploadFile = async (
  file: File,
  options?: UploadApiOptions
): Promise<UploadApiResponse> => {
  const buffer = Buffer.from(await file.arrayBuffer());
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options || {}, (err, result) => {
        if (err) return reject(err);
        resolve(result as UploadApiResponse);
      })
      .end(buffer);
  });
};
