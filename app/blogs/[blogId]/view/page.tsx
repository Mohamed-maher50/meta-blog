import Container from "@/components/utils/Container";

import { BlogCardProps } from "@/types";
import { headers as NextHeaders } from "next/headers";
import { notFound } from "next/navigation";

import { JSONContent } from "novel";
import { baseUrl } from "@/lib/baseUrl";
import UserBlogNav from "@/components/UserBlogNav";
import UpdateBlogView from "@/components/utils/UpdateBlogView";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import BlogTopics, {
  BlogTopicsSkeletons,
} from "@/components/topics/BlogTopics";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import TaskItems from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { Underline } from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import BlogComments from "@/components/comments/blog-comments";
import { FontFamily } from "@tiptap/extension-font-family";

import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";

import { Mathematics } from "@/components/novel/generative/math";
import { cx } from "class-variance-authority";
interface ViewPageBlog extends BlogCardProps {
  content: JSONContent;
}

const page = async ({ params }: { params: Promise<{ blogId: string }> }) => {
  const { blogId } = await params;
  const headers = new Headers(await NextHeaders());
  const res = await fetch(`${baseUrl}/api/blogs/${blogId}`, {
    headers,
    next: {
      revalidate: 60,
    },
  });
  if (!res.ok) notFound();

  const blog: ViewPageBlog = await res.json();
  const isLiked = blog.BlogLike.length > 0;
  const html = generateHTML(blog.content, [
    StarterKit.configure({}),
    TextStyle.configure({ mergeNestedSpanStyles: true }),
    Color,
    TaskItems,
    TaskList,
    Underline,
    Highlight,
    Link,
    FontFamily,
    Youtube,
    Mathematics.configure({
      HTMLAttributes: {
        class: cx("text-foreground rounded p-1 hover:bg-accent cursor-pointer"),
      },
      katexOptions: {
        throwOnError: false,
      },
    }),
    Image,
  ]);
  return (
    <div className="mt-16">
      <UpdateBlogView blogId={blogId} />
      <Container>
        <ErrorBoundary fallback={"error"}>
          <Suspense fallback={<BlogTopicsSkeletons />}>
            <BlogTopics blogId={blogId} />
          </Suspense>
        </ErrorBoundary>
        <UserBlogNav
          isLiked={isLiked}
          user={blog.author}
          blogId={blogId}
          blog={blog}
        />
        <div className="prose prose-lg overflow-hidden dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full">
          <div dangerouslySetInnerHTML={{ __html: html }}></div>
        </div>
        <BlogComments blogId={blogId} blog={blog} />
      </Container>
    </div>
  );
};

export default page;
