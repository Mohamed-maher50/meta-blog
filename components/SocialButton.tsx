import React, { JSX } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
interface ISocialButton {
  link: string;
  Icon: JSX.Element;
}
const SocialButton = ({ link, Icon }: ISocialButton) => {
  return (
    <Button asChild variant={"outline"} size={"icon"}>
      <Link href={link}>{Icon}</Link>
    </Button>
  );
};

export default SocialButton;
