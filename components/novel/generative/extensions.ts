import {
  AIHighlight,
  CharacterCount,
  CodeBlockLowlight,
  Color,
  CustomKeymap,
  HighlightExtension,
  HorizontalRule,
  Mathematics,
  Placeholder,
  StarterKit,
  TaskItem,
  TaskList,
  TextStyle,
  TiptapImage,
  TiptapLink,
  TiptapUnderline,
  Twitter,
  UpdatedImage,
  UploadImagesPlugin,
  Youtube,
  GlobalDragHandle,
} from "novel";
import { Heading } from "@tiptap/extension-heading";
import AutoJoiner from "tiptap-extension-auto-joiner";
import { cx } from "class-variance-authority";
import { common, createLowlight } from "lowlight";

//TODO I am using cx here to get tailwind autocomplete working, idk if someone else can write a regex to just capture the class key in objects
const aiHighlight = AIHighlight;
//You can overwrite the placeholder with your own configuration
const placeholder = Placeholder;
const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class: cx(
      "text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer"
    ),
  },
});

const tiptapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: cx("opacity-40 rounded-lg border border-stone-200"),
      }),
    ];
  },
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted"),
  },
});

const updatedImage = UpdatedImage.configure({
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted"),
  },
});

const taskList = TaskList.configure({
  HTMLAttributes: {
    class: cx("not-prose pl-2 "),
  },
});
const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: cx("flex gap-2 items-start my-4"),
  },
  nested: true,
});

const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: cx("mt-4 mb-6 border-t border-muted-foreground"),
  },
});

const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: cx("list-disc list-outside leading-3 -mt-2"),
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: cx("list-decimal list-outside leading-3 -mt-2"),
    },
  },
  listItem: {
    HTMLAttributes: {
      class: cx("leading-normal -mb-2"),
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: cx("border-l-4 border-primary"),
    },
  },
  codeBlock: {
    HTMLAttributes: {
      class: cx(
        "rounded-md bg-muted text-muted-foreground border p-5 font-mono font-medium"
      ),
    },
  },
  code: {
    HTMLAttributes: {
      class: cx("rounded-md bg-muted  px-1.5 py-1 font-mono font-medium"),
      spellcheck: "false",
    },
  },
  horizontalRule: false,
  dropcursor: {
    color: "#DBEAFE",
    width: 4,
  },
  gapcursor: false,
});

const codeBlockLowlight = CodeBlockLowlight.configure({
  lowlight: createLowlight(common),
});

const youtube = Youtube.configure({
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted"),
  },
  inline: false,
});

const twitter = Twitter.configure({
  HTMLAttributes: {
    class: cx("not-prose"),
  },
  inline: false,
});

const mathematics = Mathematics.configure({
  HTMLAttributes: {
    class: cx("text-foreground rounded p-1 hover:bg-accent cursor-pointer"),
  },
  katexOptions: {
    throwOnError: false,
  },
});

const characterCount = CharacterCount.configure();
import { Extension, Extensions } from "@tiptap/core";
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import type { EditorView } from "prosemirror-view";
import type { Transaction } from "prosemirror-state";

export const ForceTitleExtension = Extension.create({
  name: "forceTitle",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          // 1. منع حذف أول عقدة (العنوان H1)
          handleKeyDown: (view: EditorView, event: KeyboardEvent): boolean => {
            if (event.key === "Backspace" || event.key === "Delete") {
              const { selection } = view.state;
              // إذا كان المؤشر في بداية المستند تماماً قبل العنوان
              if (selection.empty && selection.anchor === 0) {
                // anchor === 0 هو بداية المستند
                return true; // منع الحدث الافتراضي (الحذف)
              }
            }
            return false;
          },

          // 2. ضمان ألا يكون العنوان فارغًا تمامًا (Placeholder إجباري)
          decorations: (state) => {
            const decorations: Decoration[] = [];
            const firstNode = state.doc.firstChild;

            // التحقق من أن العقدة الأولى هي H1 وأنها فارغة
            if (
              firstNode &&
              firstNode.type.name === "heading" &&
              firstNode.attrs.level === 1 &&
              firstNode.content.size === 0
            ) {
              // إضافة Placeholder لجعلها تبدو وكأنها تحتوي على نص
              decorations.push(
                Decoration.node(0, firstNode.nodeSize, {
                  class: "is-empty-title-placeholder",
                })
              );
            }
            return DecorationSet.create(state.doc, decorations);
          },

          // 3. منع إضافة أي style آخر غير H1 لأول سطر
          // هذا يتم التعامل معه جزئياً في الـ Plugin التالي، ولكن هذا يمنع المستخدم من تطبيق زر الـ style toolbar
        },
      }),

      // Plugin 2: التأكد من أن أول سطر هو H1 دائماً
      new Plugin({
        state: {
          init: () => null,
          apply: (tr: Transaction, value, oldState, newState) => {
            const firstNode = newState.doc.firstChild;

            // إذا لم يكن أول عنصر H1، نقوم بتعديله فوراً
            if (
              firstNode &&
              (firstNode.type.name !== "heading" || firstNode.attrs.level !== 1)
            ) {
              // replaceWith يستخدم نطاق العقدة الأولى بالكامل
              tr.replaceWith(
                0,
                firstNode.nodeSize,
                newState.schema.nodes.heading.create(
                  { level: 1 },
                  firstNode.content
                )
              );

              // تطبيق التغيير فوراً
              // ملاحظة: في Tiptap، يفضل إرسال المعاملة الجديدة بدلاً من استخدام view.focus() هنا مباشرة
              // view.dispatch(tr); // لا يمكن الوصول إلى view هنا
            }
            return value;
          },
        },
      }),
    ];
  },
});

export const defaultExtensions = [
  Heading.configure({
    levels: [1, 2, 3],
  }),
  starterKit.configure({
    heading: false,
    codeBlock: false,
    horizontalRule: false,
    // listItem: false,
  }),
  placeholder,
  tiptapLink, //done
  // tiptapImage,
  updatedImage,
  taskList, //done
  taskItem, //done
  horizontalRule, //done
  aiHighlight,
  codeBlockLowlight, //done
  youtube,
  twitter,
  mathematics,
  characterCount,
  TiptapUnderline,
  HighlightExtension,
  AutoJoiner,
  TextStyle,
  Color,
  CustomKeymap,
  GlobalDragHandle.configure({
    dragHandleWidth: 20,
    scrollTreshold: 100,
  }),
];
export const renderExtensions: Extensions = [
  StarterKit,
  HighlightExtension,
  Heading.configure({
    levels: [1, 2, 3],
  }),

  HorizontalRule,
  tiptapImage,
  TaskList,
  TaskItem,

  // codeBlockLowlight,
  Color,
  TextStyle,
];
