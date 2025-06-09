import ArticleCard from "@/components/ArticleCard";
import SocialButton from "@/components/SocialButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import React from "react";

const AuthorPage = () => {
  return (
    <div className="flex py-6 flex-col gap-28">
      <div className=" w-full font-work-sans bg-secondary-50 dark:bg-secondary-700 rounded-md flex justify-center items-center p-12">
        <div className="flex w-full max-w-[42rem]  justify-center flex-col items-center gap-6 ">
          <div className=" flex  gap-2">
            <Avatar className="w-16 h-16">
              <AvatarImage src={"https://github.com/shadcn.png"} />
              <AvatarFallback>MM</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-xl dark:text-white text-secondary-foreground-800">
                Jonathan Doe
              </h3>
              <p className=" dark:text-secondary-foreground-300 text-secondary-foreground-500">
                Collaborator & Editor
              </p>
            </div>
          </div>
          <p className="text-center text-secondary-foreground-600 dark:text-secondary-foreground-300 text-lg font-normal">
            Meet Jonathan Doe, a passionate writer and blogger with a love for
            technology and travel. Jonathan holds a degree in Computer Science
            and has spent years working in the tech industry, gaining a deep
            understanding of the impact technology has on our lives.
          </p>
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

export default AuthorPage;
