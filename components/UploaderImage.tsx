"use client";

import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageUploadMinimalProps {
  initialImageUrl?: string;
  onChange?: (file: File) => void;
  reset?: (value: null) => void;
}

export function ImageUpload({
  initialImageUrl,
  onChange,
  reset,
}: ImageUploadMinimalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;

    onChange?.call(null, file);
  };

  return (
    <div className="space-y-2 ">
      {initialImageUrl && (
        <div className="relative w-full h-52 rounded-lg overflow-hidden bg-secondary/50 group">
          <Image
            width={60}
            height={60}
            src={initialImageUrl || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <Button
            asChild
            type="button"
            size={"icon"}
            onClick={() => {
              reset?.call(null, null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="absolute top-1 right-1  p-1 bg-destructive/90 hover:bg-destructive text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="hidden"
      />

      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        variant={initialImageUrl ? "outline" : "ghost"}
        className="w-full"
        size="sm"
      >
        <Upload className="w-4 h-4 mr-2" />
        {initialImageUrl ? "Change Image" : "Upload Image"}
      </Button>
    </div>
  );
}
