import { v2 as cloudinary } from "cloudinary";
console.log({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});
export const POST = async (req: Request) => {
  // cloudinary.
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return new Response("No file provided", { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());

  const res = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "blogs/thumbnails" }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      })
      .end(buffer);
  });

  return Response.json(res);
};
