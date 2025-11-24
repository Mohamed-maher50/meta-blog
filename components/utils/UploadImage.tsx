import { Input } from "@/components/ui/input";
import Image from "next/image";
interface ImageUploadProps
  extends Omit<React.ComponentProps<"input">, "value"> {
  url?: string;
}
export default function ImageUpload({ url, ...props }: ImageUploadProps) {
  return (
    <div className="space-y-4 p-4 border rounded-xl shadow-sm">
      <Input type="file" accept="image/*" {...props} />
      {url && (
        <Image
          src={url}
          alt="Preview"
          width={700}
          height={700}
          className="w-full h-64 object-cover rounded-md border"
        />
      )}
    </div>
  );
}
