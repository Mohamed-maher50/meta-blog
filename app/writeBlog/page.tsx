"use client";
import Tiptap, { ExtendedImage } from "@/components/tipTap/richTextEditor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/UploadImage";
import {
  createBlogSchema,
  createBlogSchemaTypes,
} from "@/schema/createBlogSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import TextAlign from "@tiptap/extension-text-align";
import { Editor, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import { Image } from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import BulletList from "@tiptap/extension-bullet-list";
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
const WriteBlog = () => {
  const form = useForm<createBlogSchemaTypes>({
    resolver: zodResolver(createBlogSchema),
  });
  const session = useSession();

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Highlight,
      // CodeBlockLowlight.configure({
      //   lowlight,
      // }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
        isAllowedUri: (url, ctx) => {
          try {
            // construct URL
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`);

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false;
            }

            // disallowed protocols
            const disallowedProtocols = ["ftp", "file", "mailto"];
            const protocol = parsedUrl.protocol.replace(":", "");

            if (disallowedProtocols.includes(protocol)) {
              return false;
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map((p) =>
              typeof p === "string" ? p : p.scheme
            );

            if (!allowedProtocols.includes(protocol)) {
              return false;
            }

            // disallowed domains
            const disallowedDomains = [
              "example-phishing.com",
              "malicious-site.net",
            ];
            const domain = parsedUrl.hostname;

            if (disallowedDomains.includes(domain)) {
              return false;
            }

            // all checks have passed
            return true;
          } catch {
            return false;
          }
        },
        shouldAutoLink: (url) => {
          try {
            // construct URL
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`https://${url}`);

            // only auto-link if the domain is not in the disallowed list
            const disallowedDomains = [
              "example-no-autolink.com",
              "another-no-autolink.com",
            ];
            const domain = parsedUrl.hostname;

            return !disallowedDomains.includes(domain);
          } catch {
            return false;
          }
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc",
        },
      }),
      Underline,
      ExtendedImage,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: 10000 * 1000,
        limit: 1,
        // upload: async (file) => {
        //   if (!editorRef.current) throw new Error("Editor not ready");
        //   const compressedFile = await imageCompression(file, {
        //     maxSizeMB: 1,
        //     useWebWorker: true,
        //     fileType: "image/webp",
        //     maxWidthOrHeight: 1920,
        //     initialQuality: 0.8,
        //   });
        //   return await uploadToServer(compressedFile);
        //   // return await uploadImageAndUpdate(editorRef.current, compressedFile);
        // },

        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    parseOptions: { preserveWhitespace: "full" },
    editorProps: {
      attributes: {
        class: cn(
          "min-h-96  px-2 py-4 focus-visible:outline-none overflow-hidden block"
        ),
      },
    },
    content: "<p>Hello World! 🌎️</p>",
  });
  const handleSubmit = async (editor: Editor) => {
    // const images = editor.$nodes("image");
    const { data } = await axios.post("/api/blogs", {
      content: editor.getJSON(),
      title: "blog 1",
      category: "technology",
      userId: session.data?.user.userId,
    });
    console.log(data);
  };
  const handleSubmitForm = async (e: createBlogSchemaTypes) => {
    const formData = new FormData();
    formData.append("cover", e.cover);

    formData.append(
      "body",
      JSON.stringify({
        content: editor?.getJSON(),
        title: e.title,
        category: e.category,
        userId: session.data?.user.userId,
      })
    );
    const { data } = await axios.post("/api/blogs", formData);
    console.log(data);
  };
  return (
    <div className="overflow-hidden">
      <Form {...form}>
        <form
          className="flex flex-col   gap-4 "
          onSubmit={form.handleSubmit(handleSubmitForm)}
        >
          <Button className="w-fit">Publish</Button>

          <div className="flex  flex-row-reverse gap-2 flex-wrap">
            <FormField
              name="category"
              render={({ field }) => {
                return (
                  <FormItem className="grow">
                    <FormLabel>category</FormLabel>
                    <FormControl>
                      <Input className="" placeholder="category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="title"
              render={({ field }) => {
                return (
                  <FormItem className="grow">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input className="" placeholder="title" {...field} />
                    </FormControl>{" "}
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <FormField
            name="cover"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Image cover</FormLabel>
                  <FormControl>
                    <ImageUpload onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </form>
      </Form>
      <hr className="my-6   mx-24 border-2 border-secondary " />
      {editor && <Tiptap editor={editor} handleSubmit={handleSubmit} />}
    </div>
  );
};

export default WriteBlog;
