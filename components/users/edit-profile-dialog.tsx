"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash } from "lucide-react";
import { UserInfo } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { socialLink } from "@/constants/socialMediaLinks";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { toast } from "sonner";

import { useSession } from "next-auth/react";
import UploadAvatarInput from "../UploadAvatarInput";
import { Label } from "../ui/label";
import { getDirtyValues } from "@/lib/utils";
import { onUpload } from "../utils/image-upload";
import { createUserSchema, createUserValues } from "@/schema/createUserSchema";
import { Social } from "@prisma/client";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axios.client";

interface EditProfileDialogProps {
  user: UserInfo;
}
export function EditProfileDialog({ user }: EditProfileDialogProps) {
  const { update } = useSession();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [updatedImage, setUpdatedImage] = useState<null | File>(null);

  const form = useForm<createUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: async () => {
      return {
        ...user,
      };
    },
  });
  const previewUrl = useMemo(() => {
    const previewUrl = updatedImage
      ? URL.createObjectURL(updatedImage)
      : undefined;
    return previewUrl;
  }, [updatedImage]);
  const handleSubmit = async () => {
    if (updatedImage) {
      const uploadImageResult = await onUpload(updatedImage, {
        headers: {
          "x-type-image": "avatar",
        },
      });
      form.setValue("image", uploadImageResult.secure_url, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setUpdatedImage(null);
    }
    const dirtyFields = getDirtyValues(form);

    const request = axiosClient.put("/api/profile", dirtyFields, {
      // withCredentials: true,
    });
    const toastOptions = {
      success: ({ data }: { data: UserInfo }) => {
        update({
          image: data.image,
        });
        setOpen(false);
        router.refresh();
        return "Profile updated successfully";
      },
      error: () => {
        return "Failed to update profile";
      },
      loading: "Updating profile...",
    };
    toast.promise(request, toastOptions);
  };

  return (
    <Form {...form}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information and social media links.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-center ">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => {
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      const { value, ...props } = field;
                      return (
                        <FormItem className="mb-4 flex justify-center flex-col items-center cursor-pointer ">
                          <FormControl>
                            <UploadAvatarInput
                              {...props}
                              onChange={setUpdatedImage}
                              url={previewUrl || form.getValues("image")}
                              avatarPlaceholder={
                                form.getValues("name")?.slice(0, 1) ||
                                "loading..."
                              }
                            />
                          </FormControl>
                          <Label>Update your Picture</Label>
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => {
                    return (
                      <FormItem className="">
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="space-y-2">
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
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            className="focus-visible:text-secondary-foreground-900  font-work-sans text-secondary-foreground-500 dark:text-muted-foreground dark:focus-visible:text-secondary-50 duration-500"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Social Media Links</h3>
              <div className=" w-full grid grid-cols-2 gap-2">
                {(
                  Object.entries(user.Social) as [
                    keyof Social,
                    Social[keyof Social]
                  ][]
                ).map(([key]) => {
                  return (
                    <div
                      key={key}
                      className="flex  justify-center items-center gap-2"
                    >
                      <FormField
                        name={`Social.${key}`}
                        control={form.control}
                        render={({ field }) => {
                          const { Icon, placeholder } = socialLink[key];
                          return (
                            <FormItem className="grow space-y-2">
                              <FormLabel>{key}</FormLabel>
                              <FormControl>
                                <div className="relative isolate">
                                  <Icon
                                    className="absolute pointer-events-none translate-x-1/2 translate-y-1/2 left-0 top-0  text-secondary-foreground "
                                    size={18}
                                  />
                                  <Input
                                    className="flex-1 ps-9 placeholder:text-muted-foreground placeholder:opacity-60 caret-secondary-foreground-500 w-full grow"
                                    {...field}
                                    placeholder={placeholder}
                                  />
                                  <span
                                    onClick={() => {
                                      form.setValue(`Social.${key}`, "", {
                                        shouldDirty: true,
                                      });
                                    }}
                                    className="absolute z-10 hover:text-red-600 right-5 top-1/2 translate-y-[-50%] cursor-pointer text-secondary-foreground"
                                    hidden={!field.value}
                                  >
                                    <Trash size={14} />
                                  </span>
                                </div>
                              </FormControl>
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updatedImage || form.formState.isDirty ? false : true}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
