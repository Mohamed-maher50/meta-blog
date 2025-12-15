import Container from "../utils/Container";

import { Separator } from "../ui/separator";
import Logo from "../miscellaneous/Logo";
import SubscriptionForm from "../SubscriptionForm";

const Footer = () => {
  return (
    <footer className="bg-secondary-50 place-items-end dark:bg-secondary-900 text-secondary-foreground-500 dark:text-secondary-foreground-400 py-10 sm:py-16 border-t border-secondary-100 dark:border-t-secondary-700">
      <Container>
        <div className="max-sm:flex-wrap mb-16 max-md:flex-col flex basis-1 gap-5 text-lg font-semibold font-work-sans ">
          <div className="flex-2 basis-2 ">
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
          <div className="flex-[1.8]  gap-7 justify-center items-center flex flex-col  bg-white dark:bg-secondary-700 rounded-2xl p-9">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-secondary-foreground-800 dark:text-white font-semibold text-xl">
                Weekly Newsletter
              </h1>
              <p className="text-secondary-foreground-500 dark:text-secondary-foreground-400 text-base">
                Get blog articles and offers via email
              </p>
            </div>
            <SubscriptionForm />
          </div>
        </div>
        <div className="sm:flex py-4 sm:py-8 ">
          <div className="sm:grow max-sm:mb-10">
            <Logo className="relative after:absolute after:-bottom-8 sm:after:-bottom-6   after:w-full   after:block isolate after:text-secondary-foreground-600 dark:after:text-secondary-foreground-300 after:left-0 after:content-['©_Template_2023._All_Rights_Reserved.']" />
          </div>

          <div className="max-sm:flex-col flex gap-1.5 sm:gap-3 text-secondary-foreground-600 text-base dark:text-secondary-foreground-300">
            <span>Terms of Use</span>
            <Separator orientation="horizontal" className="sm:hidden" />
            <Separator orientation="vertical" className="max-sm:hidden" />
            <span>Privacy Policy</span>
            <Separator orientation="horizontal" className="sm:hidden" />
            <Separator orientation="vertical" className="max-sm:hidden" />

            <span>Cookie Policy</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
