import TailwindAdvancedEditor from "@/components/advanced-editor";
import BlogComments from "@/components/comments/blog-comments";
import Container from "@/components/utils/Container";
import { Badge } from "@/components/ui/badge";
import UpdateBlogView from "@/components/utils/UpdateBlogView";
import UserBlogNav from "@/components/UserBlogNav";
import { Join } from "@/types";
import { Blog, User } from "@prisma/client";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/prisma";
import { JSONContent } from "novel";
import React from "react";
import { AppError } from "@/lib/GlobalErrorHandler";
import { baseUrl } from "@/lib/baseUrl";
type IAuthorBlog = Join<Blog, User, "author">;
type UserWithBlogs = Join<Blog, string[], "BlogLike">;
type BlogPageResponse = IAuthorBlog & UserWithBlogs;
const page = async ({ params }: { params: Promise<{ blogId: string }> }) => {
  const { blogId } = await params;

  const requestHeaders = await headers();
  const res = await fetch(`${baseUrl}/api/blogs/${blogId}`, {
    headers: requestHeaders,
  });
  if (!res.ok)
    throw new AppError("FIELD TO GET BLOG ID CHECK BLOG ID IS CORRECT!", 400);
  const d: BlogPageResponse = await res.json();
  const BlogTopics = await prisma.blogTopics.findMany({
    where: { blogId },
    include: { topic: true },
  });
  if (res.status === 404) notFound();
  const isLiked = d.BlogLike.length > 0;
  return (
    <div className="mt-16">
      <UpdateBlogView blogId={blogId} />
      <Container>
        <UserBlogNav
          isLiked={isLiked}
          user={d.author}
          blogId={blogId}
          blog={d}
        />
        <div className=" items-center  flex-wrap">
          {/* <h1 className="font-semibold text-4xl my-6 font-work-sans">
            {d.title}
          </h1> */}
          <div className="flex    gap-2">
            {BlogTopics.map((t) => {
              return (
                <Badge
                  key={t.topic.id}
                  role="heading"
                  variant={"outline"}
                  className="cursor-auto font-work-sans"
                >
                  {t.topic.label}
                </Badge>
              );
            })}
          </div>
        </div>
        <TailwindAdvancedEditor
          editable={false}
          defaultContent={d.content as JSONContent}
        />
        <BlogComments blogId={blogId} blog={d} />
      </Container>
    </div>
  );
};

export default page;
