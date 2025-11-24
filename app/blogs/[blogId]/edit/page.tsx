"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { getDirtyValues, GetReadTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Topics } from "@prisma/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Container from "@/components/utils/Container";
import MultipleSelectorWithAsyncSearchAndCreatable from "@/components/ui/MultipleSelectorWithAsyncSearchAndCreatable";
import { Option } from "@/components/ui/multipleSelector";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useParams, useRouter } from "next/navigation";
import { BlogWithRelations, ResponseSuccess } from "@/types";
import { EditBlogSchema, EditBlogSchemaTypes } from "@/schema/EditBlogSchema";
import TailwindAdvancedEditor from "@/components/advanced-editor";
import { EditorInstance } from "novel";
import { ImageUpload } from "@/components/UploaderImage";
import { onUpload } from "@/components/utils/image-upload";
import { getTopics } from "@/lib/Topics";
import { getBlogById } from "@/lib/blogs";
import BlogPageLoading from "./loading";
const EDIT_TOAST_OPTIONS = {
  loading: "SAVING...",
  success: "Blog published successfully!",
  error: "Failed to publish blog.",
};

const EditBlogPage = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const [blog, setBlog] = useState<BlogWithRelations | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const previewUrl = coverFile ? URL.createObjectURL(coverFile) : undefined;
  const form = useForm<EditBlogSchemaTypes>({
    resolver: zodResolver(EditBlogSchema),
    defaultValues: async () => {
      const blog = await getBlogById<BlogWithRelations>(blogId);
      setBlog(blog);
      const topics = blog.BlogTopics.map((topic) => {
        return {
          label: topic.topic.label,
          value: topic.topic.id,
        };
      });
      return {
        ...blog,
        topics,
      };
    },
  });
  const router = useRouter();
  const session = useSession();
  const onCreateTopic = async (v: Option): Promise<Option | null> => {
    try {
      const { data }: { data: Topics } = await axios.post("/api/topics", {
        label: v.value,
      });
      v.value = data.id;
      return v;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  };
  const handleSubmitForm = async () => {
    const dirtyFields = getDirtyValues(form);
    if (coverFile) {
      const { secure_url, public_id } = await onUpload(coverFile);
      dirtyFields.cover = {
        public_id,
        src: secure_url,
      };
    }
    const request = axios.put(`/api/blogs/${blogId}`, dirtyFields);
    toast.promise(request, EDIT_TOAST_OPTIONS);
    request.finally(() => {
      form.reset(form.getValues());
      setCoverFile(null);
    });
  };
  const onEditorUpdate = (editor: EditorInstance) => {
    const firstNode = editor.state.doc.content.firstChild;
    if (firstNode && form.getValues("title") !== firstNode?.textContent.trim())
      form.setValue("title", firstNode.textContent.trim(), {
        shouldDirty: true,
      });
    const readingTime = GetReadTime(editor.getText());
    if (form.getValues("readingTime") != readingTime)
      form.setValue("readingTime", GetReadTime(editor.getText()), {
        shouldDirty: true,
      });
    form.setValue("content", editor.getJSON(), { shouldDirty: true });
  };
  const onSearchTopics = async (query: string): Promise<Option[]> => {
    try {
      const { data }: ResponseSuccess<Topics[]> = await getTopics(
        `/api/topics?limit=10&q=${query}`
      );
      return data.map((topic) => ({
        label: topic.label,
        value: topic.id,
      }));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return [];
    }
  };
  if (session.data?.user != blog?.authorId) router.back();
  if (form.formState.isLoading) return <BlogPageLoading />;
  return (
    <div className="overflow-hidden ">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="w-fit ml-auto"
            type="button"
            disabled={form.formState.isSubmitting}
          >
            Publish
          </Button>
        </DialogTrigger>
        <DialogContent className="!max-w-full py-24 rounded-none max-h-full !h-full !w-full">
          <Form {...form}>
            <form
              className="flex flex-col   gap-2 "
              onSubmit={form.handleSubmit(handleSubmitForm)}
            >
              <Container>
                <div className="lg:flex gap-20">
                  <div className="flex-1 flex max-lg:gap-2 md:flex-col max-lg:flex-col gap-4">
                    <DialogHeader className="text-xl">
                      🎉 Almost done! Review your details and click &quot;Save
                      Now&quot;.
                    </DialogHeader>
                    <DialogDescription>
                      ⚠️ Upload a high-quality, responsive cover image for your
                      blog.
                    </DialogDescription>
                    <ImageUpload
                      initialImageUrl={
                        previewUrl || form.getValues("cover.src")
                      }
                      onChange={setCoverFile}
                      reset={setCoverFile}
                    />

                    <DialogTitle>
                      <span className=" font-work-sans">Blog Title: </span>
                      <code className="text-muted-foreground">
                        {form.getValues("title")}
                      </code>
                    </DialogTitle>
                  </div>
                  <div className="flex flex-col gap-4 mt-10 md:mt-0">
                    <h1>Publishing to: {session.data?.user.name}</h1>

                    <p>
                      Add or change topics (up to 5) so readers know what your
                      story is about
                    </p>
                    <FormField
                      control={form.control}
                      name="topics"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormControl>
                              <MultipleSelectorWithAsyncSearchAndCreatable
                                onSearch={onSearchTopics}
                                onChange={field.onChange}
                                disabled={form.formState.isSubmitting}
                                withCreate
                                value={field.value}
                                maxSelected={5}
                                onMaxSelected={() => {
                                  toast.error(
                                    "you can't select up to 5 topics"
                                  );
                                }}
                                placeholder="add a topic..."
                                emptyIndicator={
                                  <p className="w-full capitalize text-center text-xs leading-10 text-muted-foreground">
                                    no Found Topics.
                                  </p>
                                }
                                onCreate={onCreateTopic}
                              />
                            </FormControl>
                          </FormItem>
                        );
                      }}
                    />

                    <DialogFooter className="sm:justify-start">
                      <Button
                        disabled={
                          form.formState.isSubmitting ||
                          (!coverFile ? !form.formState.isDirty : false)
                        }
                        type="submit"
                      >
                        Save
                      </Button>

                      <DialogClose
                        disabled={form.formState.isSubmitting}
                        asChild
                      >
                        <Button type="button" variant="secondary">
                          Go back
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </div>
                </div>
              </Container>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <TailwindAdvancedEditor
        defaultContent={form.getValues("content")}
        onUpdate={onEditorUpdate}
      />
    </div>
  );
};

export default EditBlogPage;
