export const UPLOAD_COVER_IMAGE = {
  transformation: {
    folder: "blog_images",
    transformation: [{ quality: "auto:best" }], // Original
  },
  eager: [
    {
      width: 1920,
      height: 1080,
      crop: "fill",
      gravity: "auto:faces",
    }, // Cover
    {
      width: 800,
      height: 450,
      crop: "fill",
      gravity: "auto:faces",
    }, // Card
  ],
  eager_async: true,
};
