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
import { getUserDate } from "@/lib/api/GetUser";
import {
  SettingsFormValuesType,
  SettingValuesSchema,
} from "@/schema/UserSettingsSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { memo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const SettingsPage = () => {
  const s = useSession();
  const form = useForm<SettingsFormValuesType>({
    resolver: zodResolver(SettingValuesSchema),
    defaultValues: async () => {
      const { email, name, bio, jobTitle, image } = await getUserDate(
        s.data?.user.userId || ""
      );
      return {
        email,
        name,
        bio,
        jobTitle,
        url: image.url,
      };
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = async (body: SettingsFormValuesType) => {
    console.log(body);
    try {
      const formValues = new FormData();
      for (const key in form.formState.dirtyFields) {
        const typedKey = key as keyof SettingsFormValuesType;
        const value = body[typedKey];
        if (value instanceof File) formValues.append(typedKey, value);
        formValues.append(typedKey, value as string);
      }
      formValues.append("userId", s.data?.user.userId || "");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      toast.promise(axios.post("/api/profile", formValues), {
        success: ({ data }) => {
          form.reset({ ...data, url: data.image.url, image: null });
          return "Profile updated successfully";
        },
        error: (e) => {
          console.log(e);
          return "Failed to update profile";
        },
        loading: "Updating profile...",
      });
    } catch (error) {
      console.log(error);
    }
  };
  console.log(form.formState.errors);
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
              if (form.getValues("image")) {
                console.log(form.getValues("image"));
                const url = URL.createObjectURL(form.getValues("image"));
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
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem className="grow">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => {
                return (
                  <FormItem className="grow">
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </div>

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
                    <Textarea {...field} value={field.value || ""} />
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
