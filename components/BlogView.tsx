"use client";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Heading from "@tiptap/extension-heading";
import "@/components/tipTap/style.css";
import { JsonValue } from "@prisma/client/runtime/library";
export default function BlogView({ content }: { content: JsonValue }) {
  const editor = useEditor({
    editable: false,
    extensions: [StarterKit, Bold, Heading],
    content: content as JSONContent,
    editorProps: {
      attributes: {
        class: "font-work-sans",
      },
    },
  });

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}
