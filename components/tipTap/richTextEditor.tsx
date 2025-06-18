"use client";
import Link from "@tiptap/extension-link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import "./style.css";
import Code from "@tiptap/extension-code";
import { cn } from "@/lib/utils";
import MenuBar from "./MenuBar";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { all, createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import "@/components/tiptap-node/image-upload-node/image-upload-node.scss";
import { ImageUploadNode } from "../tiptap-node/image-upload-node";
import "@/styles/_keyframe-animations.scss";
import "@/styles/_variables.scss";
import { useEffect } from "react";
import { Image } from "@tiptap/extension-image";
import cloudinary from "next-cloudinary";
// Update the import path if the file exists elsewhere, for example:
// Or, if the file does not exist, create 'tiptap-utils.ts' in the 'lib' directory with the required exports.
const lowlight = createLowlight(all);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

const CustomBulletList = BulletList.extend({
  addKeyboardShortcuts() {
    return {
      "Mod-l": () => this.editor.commands.toggleBulletList(),
    };
  },
});
const CustomCodeBlock = Code.extend({
  renderHTML({ HTMLAttributes }) {
    return ["pre", { ...HTMLAttributes, class: "container" }, ["code", 0]];
  },
});
const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomBulletList,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image,
      Highlight,
      CodeBlockLowlight.configure({
        lowlight,
      }),
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
      Underline,
      Placeholder.configure({
        placeholder: (type) => {
          console.log(type);
          return "Write something …";
        },
      }),
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: 10000 * 1000,
        limit: 1,
        upload: async (d) => {
          const formData = new FormData();
          formData.append("file", d);
          const res = await fetch("/api/uploads", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          return data.url;

          // reader.onload = () => {
          //   if (typeof reader.result === "string") {
          //     resolve(reader.result);
          //   } else {
          //     reject("Invalid file data");
          //   }
          // };

          // reader.onerror = () => reject("File reading failed");

          // reader.readAsDataURL(d);
        },
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    editorProps: {
      attributes: {
        class: cn(
          "min-h-96  px-2 py-4 focus-visible:outline-none overflow-hidden block"
        ),
      },
    },
    content: "<p>Hello World! 🌎️</p>",
  });
  useEffect(() => {
    if (!editor) return;
    editor.chain().focus().setImageUploadNode().run();
  }, [editor]);
  return (
    <div className="flex-col isolate relative  flex    gap-2">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
