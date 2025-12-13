"use client";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clock, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditor } from "novel";

type ReadingInfoProps = {
  wpm?: number; // words per minute (default 200)
  className?: string;
};

export default function ReadingInfo({
  wpm = 200,
  className,
}: ReadingInfoProps) {
  const { editor } = useEditor();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(`flex items-center gap-3 `, className)}>
            <Badge
              variant="secondary"
              className="flex items-center gap-1 text-sm font-medium px-2 py-1"
            >
              <Clock className="w-4 h-4" />
              {wpm} min read
            </Badge>

            <Badge
              variant="outline"
              className="flex items-center gap-1 text-sm font-medium px-2 py-1"
            >
              <FileText className="w-4 h-4" />
              {editor?.storage.characterCount.characters()} characters
            </Badge>
          </div>
        </TooltipTrigger>

        <TooltipContent side="top">
          Estimated reading time based on {wpm} words per minute.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
