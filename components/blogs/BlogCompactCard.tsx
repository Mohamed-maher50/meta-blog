import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { HtmlHTMLAttributes } from "react";
import { BlogCardProps } from "@/types";
interface BlogCardCompactProps extends HtmlHTMLAttributes<HTMLDivElement> {
  blog: BlogCardProps;
}
export function BlogCardCompact({ blog, className }: BlogCardCompactProps) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(blog.createdAt));

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={cn(
        "flex items-center  gap-3 py-3 px-4 hover:bg-secondary/50 rounded-lg transition-colors",
        className
      )}
    >
      <Avatar className="size-8 shrink-0">
        <AvatarImage
          src={blog.author.image || "/placeholder.svg"}
          alt={blog.author.name || "Author"}
        />
        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
          {getInitials(blog.author.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground line-clamp-1">
          {blog.title}
        </h4>
        <div className="flex items-center gap-2 text-xs text-secondary-foreground-500">
          <span>{blog.author.name || "Anonymous"}</span>
          <span>•</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
