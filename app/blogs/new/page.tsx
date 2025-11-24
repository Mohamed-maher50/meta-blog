"use client";
import TailwindAdvancedEditor from "@/components/advanced-editor";
import Container from "@/components/utils/Container";
import { onUpload } from "@/components/utils/image-upload";
import ReadingInfo from "@/components/miscellaneous/reading-info";
import { Button } from "@/components/ui/button";
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
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Option } from "@/components/ui/multipleSelector";
import MultipleSelectorWithAsyncSearchAndCreatable from "@/components/ui/MultipleSelectorWithAsyncSearchAndCreatable";
import { ImageUpload } from "@/components/UploaderImage";
import { defaultEditorContent } from "@/lib/content";
import { GetReadTime, wordsNumber } from "@/lib/utils";
import {
  createBlogSchema,
  createBlogSchemaTypes,
} from "@/schema/createBlogSchema";
import { ResponseSuccess } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Topics } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { useSession } from "next-auth/react";
import { EditorInstance } from "novel";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
const unProvidedValues = {
  title: "",
  preview: "",
  topics: [],
  content: {},
  readingTime: 0,
};
const NewArticle = () => {
  const session = useSession();
  const [words, setWords] = useState(0);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const previewUrl = coverFile ? URL.createObjectURL(coverFile) : undefined;
  const form = useForm<createBlogSchemaTypes>({
    resolver: zodResolver(createBlogSchema),
  });
  useEffect(() => {
    const localStoragePrevious = window.localStorage.getItem(
      "previous_defaultValues_form"
    );
    const wordsCount = window.localStorage.getItem("novel-content-length");
    if (wordsCount) {
      setWords(+wordsCount);
    }
    const previousDefaultValues = localStoragePrevious
      ? JSON.parse(localStoragePrevious)
      : unProvidedValues;
    form.reset(previousDefaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const text = editor.getText();
      setWords(wordsNumber(text));
      const formValues = form.watch();
      form.setValue("readingTime", GetReadTime(text), {
        shouldValidate: true,
        shouldDirty: true,
      });
      formValues.readingTime = GetReadTime(text);
      window.localStorage.setItem(
        "previous_defaultValues_form",
        JSON.stringify(formValues)
      );
    },
    500
  );
  const onEditorUpdate = (editor: EditorInstance) => {
    const firstNode = editor.state.doc.content.firstChild;
    if (firstNode && form.getValues("title") !== firstNode?.textContent.trim())
      form.setValue("title", firstNode.textContent.trim());
    form.setValue("content", editor.getJSON());
    debouncedUpdates(editor);
  };
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
  const handleSubmitForm = async (formValues: createBlogSchemaTypes) => {
    if (!coverFile) return toast.warning("Please Enter Cover Image");
    const { secure_url, public_id } = await onUpload(coverFile, {
      headers: {
        "x-type-image": "cover",
      },
    });
    formValues.cover = { src: secure_url, public_id };
    const request = axios.post("/api/blogs", formValues);
    toast.promise(request, {
      loading: "Publishing...",
      success: () => {
        localStorage.removeItem("previous_defaultValues_form");
        window.localStorage.removeItem("novel-content-length");
        // editor?.commands.clearContent();
        setCoverFile(null);
        form.setValue("content", undefined);
        form.reset(unProvidedValues);
        return "Blog published successfully!";
      },
      error: "Failed to publish blog.",
      finally() {},
    });
  };
  const onSearchTopics = async (value: string): Promise<Option[]> => {
    try {
      const { data }: AxiosResponse<ResponseSuccess<Topics[]>> =
        await axios.get("/api/topics?limit=10&q=" + value);
      return data.data.map((topic) => ({
        label: topic.label,
        value: topic.id,
      }));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return [];
    }
  };
  const readingTime = form.watch("readingTime");
  return (
    <div className=" py-5 ">
      <Dialog>
        <div className="flex items-center w-full justify-between ">
          <DialogTrigger asChild>
            <Button
              className="w-fit "
              type="button"
              size={"sm"}
              disabled={form.formState.isSubmitting}
            >
              Publish
            </Button>
          </DialogTrigger>
          <ReadingInfo
            className="w-fit bg-background flex gap-1.5"
            wpm={readingTime}
            wordsCount={words}
          />
        </div>
        <DialogContent className="!max-w-full py-24 rounded-none max-h-full !h-full !w-full">
          <Form {...form}>
            <form
              className="flex flex-col   gap-2 "
              onSubmit={form.handleSubmit(handleSubmitForm, (v) => {
                Object.values(v).forEach((e, idx) =>
                  toast.warning(e.message as string, {
                    duration: idx * 1200,
                  })
                );
              })}
            >
              <Container>
                <div className="lg:flex gap-20">
                  <div className="flex-1 flex max-lg:gap-2 md:flex-col max-lg:flex-col gap-4">
                    <DialogHeader className="text-xl">
                      🎉 Almost done! Review your details and click
                      &quot;Publish Now&quot;.
                    </DialogHeader>
                    <DialogDescription>
                      ⚠️ Upload a high-quality, responsive cover image for your
                      blog.
                    </DialogDescription>
                    <ImageUpload
                      initialImageUrl={previewUrl}
                      onChange={setCoverFile}
                      reset={setCoverFile}
                    />

                    <DialogTitle>
                      <span className=" font-work-sans">Blog Title : </span>
                      <code className="text-muted-foreground !text-xl">
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
                        disabled={form.formState.isSubmitting}
                        type="submit"
                      >
                        Publish Now
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
        defaultContent={form.getValues("content") || defaultEditorContent}
        onUpdate={onEditorUpdate}
      />
    </div>
  );
};

export default NewArticle;
