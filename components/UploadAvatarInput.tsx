"use client";
import React, { ComponentProps } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
interface UploadAvatarInputProps
  extends Omit<ComponentProps<"input">, "onChange" | "value"> {
  avatarPlaceholder: string;
  onChange?: (file: File) => void;
  url: string | undefined;
}
const UploadAvatarInput = ({
  onChange,
  avatarPlaceholder,
  ...props
}: UploadAvatarInputProps) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // If the input is canceled  and a file is already set, do nothing
    if (props.url && !e.target.files?.length) return;
    if (onChange && e.target?.files) onChange(e.target.files[0]);
    return null;
  };

  return (
    <>
      <label
        htmlFor="avatarInputFile"
        role="button"
        className="flex cursor-pointer  gap-2"
      >
        <Avatar className="size-24 ">
          <AvatarImage width={96} height={96} src={props.url} />
          <AvatarFallback>{avatarPlaceholder.toUpperCase()}</AvatarFallback>
        </Avatar>
      </label>
      <Input
        aria-hidden
        hidden
        type="file"
        {...props}
        onChange={handleOnChange}
        id="avatarInputFile"
      />
    </>
  );
};

export default UploadAvatarInput;
