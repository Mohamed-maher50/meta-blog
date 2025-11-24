"use client";
import React, { PropsWithChildren } from "react";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
const ToggleCheckBox = ({
  children,
  ...props
}: PropsWithChildren<CheckboxPrimitive.CheckboxProps>) => {
  return (
    <Badge
      asChild
      variant={"outline"}
      className={cn(
        props.checked === true ? "ring-primary border border-primary" : "",
        "rounded-4xl  cursor-pointer"
      )}
      role="button"
    >
      <label>
        <Checkbox
          onCheckedChange={props.onCheckedChange}
          className=" rounded-md font-work-sans !box-content p-1 "
          checked={props.checked}
        />
        {children}
      </label>
    </Badge>
  );
};

export default ToggleCheckBox;
