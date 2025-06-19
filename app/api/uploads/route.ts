import cloudinary from "@/lib/cloudinary";

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
