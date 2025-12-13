"use client";
import { EditorContent, EditorRoot, type JSONContent } from "novel";
import { defaultExtensions } from "./novel/generative/extensions";
import { memo } from "react";

interface TailwindAdvancedEditorProps {
  defaultContent?: JSONContent | null;
  editable?: boolean;
}

const TailwindAdvancedEditor = ({
  defaultContent = null,
  editable = true,
}: TailwindAdvancedEditorProps) => {
  if (!defaultContent?.content) return null;
  return (
    <div className="relative  w-full ">
      <EditorRoot>
        <EditorContent
          editable={editable}
          immediatelyRender={false}
          initialContent={defaultContent}
          shouldRerenderOnTransaction={false}
          enablePasteRules={false}
          enableInputRules={false}
          autofocus={false}
          editorProps={{
            attributes: {
              class:
                "prose prose-lg overflow-hidden dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
            },
          }}
          extensions={defaultExtensions}
          className="relative min-h-[500px] w-full border-muted  sm:mb-[calc(20vh)]   "
        />
      </EditorRoot>
    </div>
  );
};

export default memo(TailwindAdvancedEditor);
