import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { AuthorBlog } from "@/types";
import { longDate } from "@/lib/utils";
import Link from "next/link";

const ArticleCard: FC<AuthorBlog> = ({
  title,
  author,
  images,
  id,
  category,
}) => {
  const coverImage = images?.find((img) => {
    return img.type == "cover";
  });
  return (
    <Card className="h-full relative isolate">
      <Link href={`/blogs/${id}`}>
        <span className="absolute  z-10 inset-0"></span>
      </Link>
      <CardHeader>
        <Image
          src={coverImage?.secure_url || ""}
          width={800}
          height={450}
          className="object-cover w-full  mx-auto  sm:w-96 max-h-60 h-60   rounded-sm"
          alt="article 1 "
        />
      </CardHeader>

      <CardContent>
        <Badge className="bg-primary/5 text-primary">
          {category.name || "Category"}
        </Badge>
        <CardTitle className="text-secondary-foreground-800 line-clamp-2 dark:text-white">
          {title ||
            "The Impact of Technology on the Workplace: How Technology is Changing"}
        </CardTitle>
      </CardContent>

      <CardFooter className="flex mt-auto text-secondary-foreground-400">
        <div className="flex gap-2  justify-center  items-center">
          <Link
            className="relative flex justify-center items-center gap-2 z-20"
            href={`/author/${author.id}`}
          >
            {author?.image && (
              <Avatar>
                {<AvatarImage src={author.image?.url} />}

                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}

            <span className="font-medium ">{author?.name}</span>
          </Link>
          <span>{longDate(1717843200000)}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
