import { FileQuestion, Users, FileText, Search } from "lucide-react";

interface EmptyStateAlertProps {
  type: "blogs" | "users" | "topics" | "search";
  searchQuery?: string;
}

export function EmptyStateAlert({ type, searchQuery }: EmptyStateAlertProps) {
  const configs = {
    blogs: {
      icon: FileText,
      message: searchQuery
        ? `No blogs found for "${searchQuery}"`
        : "No blogs available",
    },
    users: {
      icon: Users,
      message: searchQuery
        ? `No users found for "${searchQuery}"`
        : "No users available",
    },
    topics: {
      icon: FileQuestion,
      message: searchQuery
        ? `No topics found for "${searchQuery}"`
        : "No topics available",
    },
    search: {
      icon: Search,
      message: searchQuery
        ? `No results found for "${searchQuery}"`
        : "Start searching to find content",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="mb-4 rounded-full bg-secondary p-4">
        <Icon
          className="h-8 w-8 text-secondary-foreground-400"
          strokeWidth={1.5}
        />
      </div>

      <p className="text-secondary-foreground-500 max-w-md font-semibold font-work-sans">
        {config.message}
      </p>
    </div>
  );
}
