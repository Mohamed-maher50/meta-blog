import { FileX, Bookmark } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: "bookmark" | "search";
}

export function EmptyState({
  title,
  description,
  icon = "bookmark",
}: EmptyStateProps) {
  const Icon = icon === "bookmark" ? Bookmark : FileX;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Icon size={48} className="text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md">{description}</p>
    </div>
  );
}
