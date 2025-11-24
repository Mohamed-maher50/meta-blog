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
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { Separator } from "./ui/separator";

import { uploadFn } from "./utils/image-upload";
import { defaultExtensions } from "./novel/generative/extensions";
import { NodeSelector } from "./novel/selectors/node-selector";
import { LinkSelector } from "./novel/selectors/link-selector";
import { MathSelector } from "./novel/selectors/math-selector";
import { ColorSelector } from "./novel/selectors/color-selector";
import { slashCommand, suggestionItems } from "./slash-command";
import { TextButtons } from "./novel/selectors/text-buttons";
import GenerativeMenuSwitch from "./novel/generative/generative-menu-switch";
import hljs from "highlight.js";
import { wordsNumber } from "@/lib/utils";

const extensions = [...defaultExtensions, slashCommand];
interface TailwindAdvancedEditorProps {
  defaultContent?: JSONContent | null;
  editable?: boolean;
  onUpdate?: (editor: EditorInstance) => void;
  onCreate?: (editor: EditorInstance) => void;
}

const TailwindAdvancedEditor = ({
  defaultContent = null,
  editable = true,
  onUpdate,
}: TailwindAdvancedEditorProps) => {
  //   const [saveStatus, setSaveStatus] = useState("Saved");
  //   const [charsCount, setCharsCount] = useState();

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  //Apply Codeblock Highlighting on the HTML from editor.getHTML()
  const highlightCodeblocks = (content: string) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    doc.querySelectorAll("pre code").forEach((el) => {
      // https://highlightjs.readthedocs.io/en/latest/api.html?highlight=highlightElement#highlightelement
      hljs.highlightElement(el as HTMLElement);
    });
    return new XMLSerializer().serializeToString(doc);
  };

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();
      //   setCharsCount(editor.storage.characterCount.words());
      window.localStorage.setItem(
        "html-content",
        highlightCodeblocks(editor.getHTML())
      );
      window.localStorage.setItem("novel-content", JSON.stringify(json));
      window.localStorage.setItem(
        "novel-content-length",
        JSON.stringify(wordsNumber(editor.getText()))
      );
      //   window.localStorage.setItem(
      //     "markdown",
      //     editor.storage.markdown.getMarkdown()
      //   );
      //   setSaveStatus("Saved");
    },
    500
  );

  if (!defaultContent) return null;

  return (
    <div className="relative  w-full ">
      <EditorRoot>
        <EditorContent
          editable={editable}
          initialContent={defaultContent}
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
            if (!editor || !editor.state.doc.content.childCount) {
              return ""; // Return an empty string if the editor is not initialized or empty
            }
            onUpdate?.call(null, editor);
            // The 'doc' is the root node. We want its first child.

            debouncedUpdates(editor);

            // setSaveStatus("Unsaved");
          }}
          slotAfter={<ImageResizer />}
        >
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

          <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />

            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <MathSelector />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </GenerativeMenuSwitch>
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default TailwindAdvancedEditor;
