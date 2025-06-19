"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import UploadAvatarInput from "@/components/UploadAvatarInput";
import { User } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { memo } from "react";
import { useForm } from "react-hook-form";
interface SettingsFormValues {
  email: string;
  name: string;
  bio: string;
  image: FileList | null;
  url: string;
  jobTitle: string;
}
const SettingsPage = () => {
  const s = useSession();

  const form = useForm<SettingsFormValues>({
    defaultValues: async () => {
      const {
        data,
      }: {
        data: {
          user: User;
        };
      } = await axios.get(`/api/profile/${s?.data?.user.userId}`);
      return {
        email: data.user.email,
        name: data.user.name || "d",
        bio: data.user.bio || "",
        image: null,
        url: (data?.user?.image as { url: string })?.url || "",
        jobTitle: data.user.jobTitle || "",
      };
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = async (body: SettingsFormValues) => {
    try {
      const formValues = new FormData();
      for (const key in form.formState.dirtyFields) {
        const typedKey = key as keyof SettingsFormValues;
        const value = body[typedKey];
        if (value instanceof FileList) {
          formValues.append(typedKey, value[0]);
        } else if (value !== undefined && value !== null) {
          formValues.append(typedKey, value as string);
        }
      }
      formValues.append("userId", s.data?.user.userId || "");
      const { data } = await axios.post("/api/profile", formValues);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-2">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { value, ...props } = field;

              if (field.value && field.value.length > 0) {
                const url = URL.createObjectURL(
                  field.value ? field.value[0] : new Blob()
                );
                form.setValue("url", url);
              }
              return (
                <FormItem className="mb-4 cursor-pointer mx-auto">
                  <FormControl>
                    <UploadAvatarInput
                      {...props}
                      url={form.getValues("url")}
                      avatarPlaceholder={
                        form.getValues("name")?.slice(0, 1) || "loading..."
                      }
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <FormItem className="basis-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input className="" {...field} />
                  </FormControl>
                </FormItem>
              );
            }}
          />{" "}
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => {
              return (
                <FormItem className="basis-1">
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input className="" {...field} />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <Button className="w-fit">submit</Button>
        </form>
      </Form>
    </>
  );
};

export default memo(SettingsPage);
