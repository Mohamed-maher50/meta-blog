"use client";
import { ApiGetFavoritesSuccess } from "@/app/api/favorites/route";

import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import axiosClient from "@/lib/axios.client";

interface SavedButtonProps {
  isSaved?: boolean;
  blogId?: string;
}

const SavedButton = ({ isSaved = false, blogId }: SavedButtonProps) => {
  const router = useRouter();
  const [defaultValue, setDefaultValue] = useState(isSaved);

  const handleToggleState = async () => {
    const prevState = defaultValue;
    setDefaultValue(!prevState);
    toast.promise(
      axiosClient.post<ApiGetFavoritesSuccess>("/api/favorites", { blogId }),
      {
        loading: "Saving...",
        success: ({ status }: { status: number }) => {
          if (status === 200) {
            setDefaultValue(false);
            return "UnSaved";
          }
          setDefaultValue(true);
          return "Saved";
        },
        error: () => {
          setDefaultValue(prevState);
          return "Error occurred";
        },
        action: {
          label: "Undo",
          onClick: () => {
            setDefaultValue(prevState);
          },
        },
        finally() {
          router.refresh();
        },
      }
    );
  };

  return (
    <Button
      onClick={handleToggleState}
      size="icon"
      variant="ghost"
      className="bg-background/80 backdrop-blur-sm hover:bg-background"
      aria-label={defaultValue ? "Remove from saved" : "Save blog"}
    >
      <Bookmark
        size={18}
        className={`transition-all duration-200 ${
          defaultValue
            ? "fill-primary text-primary"
            : "text-muted-foreground hover:text-primary"
        }`}
      />
    </Button>
  );
};

export default SavedButton;
