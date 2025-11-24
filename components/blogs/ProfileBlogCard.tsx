import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import { BlogWithRelations } from "@/types";
import Link from "next/link";

interface ProfileBlogCardProps {
  post: BlogWithRelations;
}

export function ProfileBlogCard({ post }: ProfileBlogCardProps) {
  return (
    <Card className="hover:border-accent h-full transition-colors overflow-hidden">
      <Link className="absolute inset-0 z-10 " href={`/blogs/${post.id}`}>
        <span className="sr-only">go to {post.title} page</span>
      </Link>
      {post.cover && (
        <div className="relative w-full h-48 bg-muted">
          <Image
            src={post.cover.src || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-xl text-balance">{post.title}</CardTitle>
            <CardDescription className="text-pretty">
              {/* {post.excerpt} */}
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          {
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readingTime}min
            </div>
          }
        </div>
      </CardHeader>
      {post.BlogTopics && post.BlogTopics.length > 0 && (
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {post.BlogTopics.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="bg-accent/20 text-accent-foreground hover:bg-accent/30"
              >
                {tag.topic.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
