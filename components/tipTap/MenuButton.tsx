import React, { JSX } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
interface IMenuButtonProps extends React.ComponentProps<"button"> {
  Icon: JSX.Element;
}
const MenuButton = ({ className, Icon, ...props }: IMenuButtonProps) => {
  return (
    <Button
      size={"icon"}
      variant={"outline"}
      {...props}
      className={cn(
        " dark:[&.active]:text-secondary-foreground-300 dark:[&.active]:border-secondary-foreground-300",
        className
      )}
    >
      {Icon}
    </Button>
  );
};

export default MenuButton;
