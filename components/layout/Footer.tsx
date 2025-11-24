import React from "react";
import Container from "../utils/Container";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Mail } from "lucide-react";
import { Separator } from "../ui/separator";
import Logo from "../miscellaneous/Logo";

const Footer = () => {
  return (
    <footer className="bg-secondary-50 place-items-end dark:bg-secondary-900 text-secondary-foreground-500 dark:text-secondary-foreground-400 py-16 border-t border-secondary-100 dark:border-t-secondary-700">
      <Container>
        <div className=" mb-16 max-md:flex-col flex basis-1 gap-5 text-lg font-semibold font-work-sans ">
          <div className="flex-[2] basis-2 ">
            <h1 className=" text-secondary-foreground-800 dark:text-white">
              About
            </h1>
            <p className="mb-6 text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam
            </p>
            <div>
              <div className="flex gap-1 text-base ">
                <span className="text-secondary-foreground-800 dark:text-white font-semibold">
                  Email :{" "}
                </span>
                <span>info@jstemplate.net</span>
              </div>
              <div className="flex gap-1  text-base">
                <span className="text-secondary-foreground-800 dark:text-white font-semibold">
                  Phone :
                </span>
                <span> 01151999565</span>
              </div>
            </div>
          </div>
          <div className="flex flex-2 md:justify-center gap-20">
            <div className=" ">
              <h1 className="text-secondary-foreground-800 dark:text-white">
                About
              </h1>
              <ul className="text-base">
                <li>Home</li>
                <li>About</li>
                <li>Blog</li>
                <li>Archived</li>
                <li>Author</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h1 className="text-secondary-foreground-800 dark:text-white font-semibold">
                Category
              </h1>
              <ul className="text-base">
                <li>Lifestyle</li>
                <li>Technology</li>
                <li>Travel</li>
                <li>Business</li>
                <li>Economy</li>
                <li>Sports</li>
              </ul>
            </div>
          </div>
          <form className="flex-[1.8]  gap-7 justify-center items-center flex flex-col  bg-white dark:bg-secondary-700 rounded-2xl p-9">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-secondary-foreground-800 dark:text-white font-semibold text-xl">
                Weekly Newsletter
              </h1>
              <p className="text-secondary-foreground-500 dark:text-secondary-foreground-400 text-base">
                Get blog articles and offers via email
              </p>
            </div>
            <div className="w-full grid gap-2">
              <div className="relative">
                <Input
                  className="w-full bg-white placeholder:text-secondary-foreground-400 dark:!bg-secondary-800  p-3.5 min-h-12"
                  placeholder="Your Email"
                />
                <Mail className="absolute right-0 -translate-x-1/2 pointer-events-none text-secondary-foreground-500 translate-y-1/2 top-0" />
              </div>
              <Button size={"lg"} className="w-full">
                Subscribe
              </Button>
            </div>
          </form>
        </div>
        <div className="flex p-8 ">
          <div className="grow">
            <Logo className="relative after:absolute after:-bottom-6   after:w-full   after:block isolate after:text-secondary-foreground-600 dark:after:text-secondary-foreground-300 after:left-10 after:content-['©_Template_2023._All_Rights_Reserved.']" />
          </div>

          <div className="flex  gap-3 text-secondary-foreground-600 text-base dark:text-secondary-foreground-300">
            <span>Terms of Use</span>
            <Separator orientation="vertical" />
            <span>Privacy Policy</span>
            <Separator orientation="vertical" />

            <span>Cookie Policy</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
