"use client";
import { BlogWithRelations } from "@/types";
import React, { FC } from "react";
import { Button } from "../ui/button";
import { Pen, Trash } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useRouter } from "next/navigation";

export const BlogOperationHeader: FC<BlogWithRelations> = (blog) => {
  const router = useRouter();
  const deleteBlogHandler = async () => {
    const deleteAxiosPromise = axios.delete(`/api/blogs/${blog.id}`);

    toast.promise(deleteAxiosPromise, {
      loading: "please wait ",
      success: `success`,
      error: "something is wrong!",
    });
  };
  return (
    <div className="flex group-hover:top-0 z-20 -top-full  group-focus-within:top-0  gap-1.5 justify-end p-3 absolute  ease-in-out     duration-300   w-full ">
      <Button
        aria-label={`update ${blog.title.slice(0, 30)} blog `}
        size={"sm"}
        className="hover:bg-primary hover:scale-95"
        onClick={() => {
          router.push(`/blogs/${blog.id}/edit`);
        }}
      >
        <Pen />
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size={"sm"}
            aria-label={`delete ${blog.title.slice(0, 30)} blog `}
            variant={"secondary"}
            className="text-red-700 hover:bg-secondary hover:scale-95  hover:text-red-700"
          >
            <Trash />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>{blog.title}</DialogTitle>
          <DialogHeader className="capitalize font-work-sans ">
            are your sure you need to delete
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button variant={"destructive"} onClick={deleteBlogHandler}>
              Yes{" "}
            </Button>
            <DialogClose>cancel</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
