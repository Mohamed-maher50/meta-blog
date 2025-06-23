import Link from "next/link";
import React from "react";
import NotFoundImage from "./NotFoundImage";

interface NotFoundMessageProps {
  ErrorTitle: string;
  ErrorDescription: string;
}
const NotFoundMessage = ({
  ErrorTitle,
  ErrorDescription,
}: NotFoundMessageProps) => {
  return (
    <div className=" bg-white dark:bg-[#181A2A] text-[#181A2A] pt-14 dark:text-white flex flex-col items-center justify-center px-4 text-center">
      <div className="w-60 h-60">
        <NotFoundImage />
      </div>
      <h1 className="text-4xl font-bold mb-4">{ErrorTitle}</h1>
      <p className="text-[#696A75] dark:text-[#BABABF] mb-6">
        {ErrorDescription}
      </p>
      <Link
        href="/"
        className="px-6 font-work-sans font-semibold py-3 bg-[#4B6BFB] text-white rounded-xl hover:bg-blue-600 transition"
      >
        Go To Home
      </Link>
    </div>
  );
};

export default NotFoundMessage;
