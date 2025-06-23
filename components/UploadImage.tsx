import { useState } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
interface ImageUploadProps
  extends Omit<React.ComponentProps<"input">, "onChange"> {
  onChange?: (file: File) => void;
}
export default function ImageUpload({ onChange, ...props }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const imageURL = URL.createObjectURL(selectedFile);
      setPreview(imageURL);
      if (onChange) onChange(selectedFile);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-xl shadow-sm">
      <Input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        {...props}
      />
      {preview && (
        <Image
          src={preview}
          alt="Preview"
          width={700}
          height={700}
          className="w-full h-64 object-cover rounded-md border"
        />
      )}
    </div>
  );
}
