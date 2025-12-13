import { Badge } from "@/components/ui/badge";
import { Topics } from "@prisma/client";

interface TopicCardProps {
  topic: Topics;
}

export function TopicRectangleCard({ topic }: TopicCardProps) {
  return (
    <Badge
      variant="outline"
      className="px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
    >
      {topic.label}
    </Badge>
  );
}
