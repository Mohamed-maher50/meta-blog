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
import { TArticle } from "@/types";
import { longDate } from "@/lib/utils";

const ArticleCard: FC<TArticle> = () => {
  return (
    <article>
      <Card>
        <CardHeader>
          <Image
            src={"https://picsum.photos/250/300"}
            width={360}
            height={240}
            className="object-cover  w-full max-h-60 h-60   rounded-sm"
            alt="article 1 "
          />
        </CardHeader>

        <CardContent>
          <Badge className="bg-primary/5 text-primary">Technology</Badge>
          <CardTitle className="text-secondary-foreground-800">
            The Impact of Technology on the Workplace: How Technology is
            Changing
          </CardTitle>
        </CardContent>
        <CardFooter className="flex text-secondary-foreground-400">
          <div className="flex gap-2 justify-center  items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="font-medium">mohamed maher</span>
            <span>{longDate(1717843200000)}</span>
          </div>
        </CardFooter>
      </Card>
    </article>
  );
};

export default ArticleCard;
