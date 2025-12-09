"use client";
import { toast } from "sonner";
import { ResponseSuccess } from "@/types";

import Container from "../utils/Container";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Topics } from "@prisma/client";
import { AxiosResponse } from "axios";
import { useSession } from "next-auth/react";
import axiosClient from "@/lib/axios.client";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Option } from "@/components/ui/multipleSelector";
import MultipleSelectorWithAsyncSearchAndCreatable from "@/components/ui/MultipleSelectorWithAsyncSearchAndCreatable";
import { ImageUpload } from "@/components/UploaderImage";
import { useFormContext } from "react-hook-form";
import { createBlogSchemaTypes } from "@/schema/createBlogSchema";
import { Button } from "../ui/button";
import { EditorInstance, useEditor } from "novel";

interface NewBlogDialogFormProps {
  onSubmit: (e: createBlogSchemaTypes, Editor: EditorInstance | null) => void;
  ImageFile: File | null;
  onImageChange: (e: File | null) => void;
}

const NewBlogDialogForm = ({
  onSubmit,
  ImageFile,
  onImageChange,
}: NewBlogDialogFormProps) => {
  const session = useSession();
  const previewUrl = ImageFile ? URL.createObjectURL(ImageFile) : undefined;
  const { editor } = useEditor();
  const { control, getValues, handleSubmit, formState } =
    useFormContext<createBlogSchemaTypes>();

  const onCreateTopic = async (v: Option): Promise<Option | null> => {
    try {
      const { data }: { data: Topics } = await axiosClient.post("/api/topics", {
        label: v.value,
      });
      v.value = data.id;
      return v;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  };

  const onSearchTopics = async (value: string): Promise<Option[]> => {
    try {
      const { data }: AxiosResponse<ResponseSuccess<Topics[]>> =
        await axiosClient.get("/api/topics?limit=10&q=" + value);
      return data.data.map((topic) => ({
        label: topic.label,
        value: topic.id,
      }));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return [];
    }
  };

  return (
    <DialogContent className="max-w-full! py-24 rounded-none max-h-full h-full! w-full!">
      <form
        className="flex flex-col   gap-2 "
        onSubmit={handleSubmit(
          (e) => onSubmit(e, editor),
          (v) => {
            Object.values(v).forEach((e, idx) =>
              toast.warning(e.message as string, {
                duration: idx * 1200,
              })
            );
          }
        )}
      >
        <Container>
          <div className="lg:flex gap-20">
            <div className="flex-1 flex max-lg:gap-2 md:flex-col max-lg:flex-col gap-4">
              <DialogHeader className="text-xl">
                🎉 Almost done! Review your details and click &quot;Publish
                Now&quot;.
              </DialogHeader>
              <DialogDescription>
                ⚠️ Upload a high-quality, responsive cover image for your blog.
              </DialogDescription>
              <ImageUpload
                initialImageUrl={previewUrl}
                onChange={onImageChange}
                reset={onImageChange}
              />

              <DialogTitle>
                <span className=" font-work-sans">Blog Title : </span>
                <code className="text-muted-foreground text-xl!">
                  {getValues("title")}
                </code>
              </DialogTitle>
            </div>
            <div className="flex flex-col gap-4 mt-10 md:mt-0">
              <h1>Publishing to: {session.data?.user.name}</h1>

              <p>
                Add or change topics (up to 5) so readers know what your story
                is about
              </p>
              <FormField
                control={control}
                name="topics"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <MultipleSelectorWithAsyncSearchAndCreatable
                          onSearch={onSearchTopics}
                          onChange={field.onChange}
                          disabled={formState.isSubmitting}
                          withCreate
                          value={field.value}
                          maxSelected={5}
                          onMaxSelected={() => {
                            toast.error("you can't select up to 5 topics");
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
                <Button disabled={formState.isSubmitting} type="submit">
                  Publish Now
                </Button>

                <DialogClose disabled={formState.isSubmitting} asChild>
                  <Button type="button" variant="secondary">
                    Go back
                  </Button>
                </DialogClose>
              </DialogFooter>
            </div>
          </div>
        </Container>
      </form>
    </DialogContent>
  );
};

export default NewBlogDialogForm;
