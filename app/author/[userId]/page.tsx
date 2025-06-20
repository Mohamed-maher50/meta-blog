import ArticleCard from "@/components/ArticleCard";
import Container from "@/components/Container";
import SocialButton from "@/components/SocialButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { IUserWithImage } from "@/types";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import React from "react";

const AuthorProfilePage = async ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  const { userId } = await params;

  const res = await fetch(`http://localhost:3000/api/profile/${userId}`, {
    method: "GET",
    cache: "force-cache",
  });
  const DbUser: IUserWithImage = await res.json();
  //   console.log(DbUser);

  if (DbUser.bio) {
    // DbUser.user.bio = DbUser.user.bio.slice(0, 399);
  }
  return (
    <div className="flex py-6 flex-col gap-28">
      <div className=" w-full font-work-sans bg-secondary-50 dark:bg-secondary-700 rounded-md flex justify-center items-center p-12">
        <div className="flex w-full   justify-center flex-col items-center gap-6 ">
          <div className=" flex  gap-2">
            <Avatar className="w-16 h-16">
              <AvatarImage src={DbUser.image.url} />
              <AvatarFallback>MM</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-xl dark:text-white text-secondary-foreground-800">
                {DbUser.name || "Jonathan Doe"}
              </h3>
              <p className=" capitalize dark:text-secondary-foreground-300 text-secondary-foreground-500">
                {DbUser.jobTitle || "Software Engineer"}
              </p>
            </div>
          </div>
          <p className=" text-justify max-md:text-center max-md:text-sm  max-md:line-clamp-6  line-clamp-4  text-secondary-foreground-600 dark:text-secondary-foreground-300 text-lg font-normal">
            {DbUser.bio}
          </p>

          <Drawer>
            <DrawerTrigger asChild>
              <Button
                hidden={(DbUser.bio?.length ?? 0) < 300}
                variant={"outline"}
                className=""
              >
                see more
              </Button>
            </DrawerTrigger>
            <DrawerContent className="">
              <Container>
                <DrawerTitle>Bio</DrawerTitle>
                <DrawerDescription className="text-lg py-6">
                  {DbUser.bio}
                </DrawerDescription>
              </Container>
            </DrawerContent>
          </Drawer>
          <div className="flex gap-2">
            <SocialButton link="" Icon={<Facebook />} />
            <SocialButton link="" Icon={<Instagram />} />
            <SocialButton link="" Icon={<Twitter />} />
            <SocialButton link="" Icon={<Youtube />} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
      </div>
    </div>
  );
};

export default AuthorProfilePage;
