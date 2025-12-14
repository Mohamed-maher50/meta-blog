"use client";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  ImageResizer,
  type JSONContent,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
} from "novel";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import ReadingInfo from "@/components/miscellaneous/reading-info";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";

import { getReadTime, wordsNumber } from "@/lib/utils";
import {
  createBlogSchema,
  createBlogSchemaTypes,
} from "@/schema/createBlogSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import { Separator } from "../ui/separator";
import { generateText } from "@tiptap/core";
import { onUpload, uploadFn } from "../utils/image-upload";
import {
  defaultExtensions,
  ForceTitleExtension,
} from "../novel/generative/extensions";
import { NodeSelector } from "../novel/selectors/node-selector";
import { LinkSelector } from "../novel/selectors/link-selector";
import { MathSelector } from "../novel/selectors/math-selector";
import { ColorSelector } from "../novel/selectors/color-selector";
import { slashCommand, suggestionItems } from "../slash-command";
import { TextButtons } from "../novel/selectors/text-buttons";
import GenerativeMenuSwitch from "../novel/generative/generative-menu-switch";
import NewBlogDialogForm from "./NewBlogDialogForm";
import { useForm } from "react-hook-form";
import axiosClient from "@/lib/axios.client";
import { toast } from "sonner";
import useGenerativeMenu from "@/hooks/useGenerativeMenu";
import { DEFAULT_BLOG_EDITOR_CONTENT } from "@/constants/defaultBlogEditorContent";
const extensions = [...defaultExtensions, slashCommand, ForceTitleExtension];
interface TailwindAdvancedEditorProps {
  defaultContent?: JSONContent | null;
  editable?: boolean;
  onCreate?: (editor: EditorInstance) => void;
}
const unProvidedValues = {
  title: "Write your amazing title here...",
  preview: "",
  topics: [],
  content: DEFAULT_BLOG_EDITOR_CONTENT,
  readingTime: 0,
};
const CreateBlogForm = ({ editable = true }: TailwindAdvancedEditorProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const form = useForm<createBlogSchemaTypes>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: unProvidedValues,
    reValidateMode: "onChange",
  });
  // update default Values from local storage
  useEffect(() => {
    const localStoragePrevious = window.localStorage.getItem(
      "previous_defaultValues_form"
    );
    const previousDefaultValues = localStoragePrevious
      ? JSON.parse(localStoragePrevious)
      : unProvidedValues;
    form.reset(previousDefaultValues, {
      keepDefaultValues: true,
    });
    setEditorKey((k) => k + 1);
  }, [form]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const { ai, color, link, node, setMenuItem } = useGenerativeMenu();
  const [dialogOpen, setDialogOpen] = useState(false);

  const content = form.getValues("content");
  const words =
    content && content.type == "doc" ? generateText(content, extensions) : "";
  const time = getReadTime(words);

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      // update Title
      const firstNode = editor.state.doc.content.firstChild;
      if (
        firstNode &&
        form.getValues("title") !== firstNode?.textContent.trim()
      )
        form.setValue("title", firstNode.textContent.trim(), {
          shouldDirty: true,
        });
      // update content every editor change
      form.setValue("content", editor.getJSON(), { shouldValidate: true });
      const json = editor.getJSON();
      window.localStorage.setItem("novel-content", JSON.stringify(json));
      const formValues = form.watch();
      window.localStorage.setItem(
        "previous_defaultValues_form",
        JSON.stringify(formValues)
      );
    },
    500
  );
  const restEditorValues = useCallback(() => {
    localStorage.removeItem("novel-content");
    localStorage.removeItem("previous_defaultValues_form");
    setCoverFile(null);
    setDialogOpen(false);
    form.reset(unProvidedValues, { keepDirty: false });
  }, [form]);
  const handleSubmitForm = async (
    formValues: createBlogSchemaTypes,
    editor: EditorInstance | null
  ) => {
    if (!editor) return;

    if (!coverFile) return toast.warning("Please Enter Cover Image");
    const { secure_url, public_id } = await onUpload(coverFile, {
      headers: {
        "x-type-image": "cover",
      },
    });
    formValues.cover = { src: secure_url, public_id };
    const request = axiosClient.post("/api/blogs", {
      ...formValues,
      readingTime: time,
    });
    toast.promise(request, {
      loading: "Publishing...",
      success: () => {
        restEditorValues();
        setEditorKey((k) => k + 1);
        return "Blog published successfully!";
      },
      error: (err) => {
        console.log(err);
        return "Failed to publish blog.";
      },
      finally() {},
    });
  };
  return (
    <div className="relative  w-full ">
      <Form {...form}>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <div className="flex items-center w-full justify-between ">
            <DialogTrigger asChild>
              <Button
                className="w-fit "
                type="button"
                size={"sm"}
                disabled={
                  form.formState.isSubmitting ||
                  !form.formState.dirtyFields.title
                }
              >
                Publish
              </Button>
            </DialogTrigger>
          </div>

          <EditorRoot>
            <EditorContent
              editable={editable}
              key={editorKey}
              initialContent={form.getValues("content")}
              autofocus
              extensions={extensions}
              className="relative min-h-[500px] w-full border-muted  sm:mb-[calc(20vh)]   "
              editorProps={{
                handleDOMEvents: {
                  keydown: (_view, event) => handleCommandNavigation(event),
                },
                handlePaste: (view, event) =>
                  handleImagePaste(view, event, uploadFn),
                handleDrop: (view, event, _slice, moved) =>
                  handleImageDrop(view, event, moved, uploadFn),
                attributes: {
                  class:
                    "prose prose-lg overflow-hidden dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
                },
              }}
              onUpdate={({ editor }) => {
                if (!editor || !editor.state.doc.content.childCount) return "";
                debouncedUpdates(editor);
              }}
              slotBefore={
                <ReadingInfo
                  className="w-fit bg-background flex gap-1.5"
                  wpm={time}
                />
              }
              slotAfter={<ImageResizer />}
            >
              <NewBlogDialogForm
                onSubmit={handleSubmitForm}
                ImageFile={coverFile}
                onImageChange={setCoverFile}
              />

              <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
                <EditorCommandEmpty className="px-2 text-muted-foreground">
                  No results
                </EditorCommandEmpty>
                <EditorCommandList>
                  {suggestionItems.map((item) => (
                    <EditorCommandItem
                      value={item.title}
                      onCommand={(val) => item.command?.call(null, val)}
                      className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                      key={item.title}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </EditorCommandItem>
                  ))}
                </EditorCommandList>
              </EditorCommand>

              <GenerativeMenuSwitch
                open={ai}
                onOpenChange={setMenuItem.bind(null, "ai")}
              >
                <Separator orientation="vertical" />
                <NodeSelector
                  open={node}
                  onOpenChange={setMenuItem.bind(null, "node")}
                />
                <Separator orientation="vertical" />

                <LinkSelector
                  open={link}
                  onOpenChange={setMenuItem.bind(null, "link")}
                />
                <Separator orientation="vertical" />
                <MathSelector />
                <Separator orientation="vertical" />
                <TextButtons />
                <Separator orientation="vertical" />
                <ColorSelector
                  open={color}
                  onOpenChange={setMenuItem.bind(null, "color")}
                />
              </GenerativeMenuSwitch>
            </EditorContent>
          </EditorRoot>
        </Dialog>
      </Form>
    </div>
  );
};

export default CreateBlogForm;
