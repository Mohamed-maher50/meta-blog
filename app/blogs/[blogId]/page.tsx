import BlogView from "@/components/BlogView";
import Container from "@/components/Container";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExtendingError } from "@/lib/utils";
import { AuthorBlog } from "@/types";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: Promise<{ blogId: string }> }) => {
  const { blogId } = await params;
  const res = await fetch(`http://localhost:3000/api/blogs/${blogId}`);

  if (!res.ok) throw new ExtendingError("504");
  const d: AuthorBlog = await res.json();
  if (res.status === 404) notFound();
  return (
    <div className="mt-16">
      <Container>
        <Button
          role="heading"
          className="cursor-auto font-work-sans hover:bg-primary"
        >
          {d.category}
        </Button>
        <h1 className="font-semibold text-4xl my-6 font-work-sans">
          {d.title}
        </h1>
        <div className="flex  gap-3 items-center">
          <Avatar>
            <AvatarImage
              src={d.author.image?.url}
              width={d.author.image?.height}
              height={d.author.image?.height}
              alt={d.author.name}
            />
          </Avatar>
          <div className="flex my-6 items-center">
            <span className="text-sm font-medium font-work-sans text-secondary-foreground-500">
              {d.author.name}
            </span>
            {/* <span>{d.author.name}</span> */}
          </div>
        </div>
        <div className="relative rounded-lg overflow-hidden isolate">
          <Image
            className=" max-h-[29rem] bg-cover"
            src={d.images[0].secure_url}
            width={1920}
            height={1080}
            priority
            alt=""
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <BlogView content={d.content} />{" "}
      </Container>
    </div>
  );
};

export default page;
