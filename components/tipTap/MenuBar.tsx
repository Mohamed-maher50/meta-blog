import {
  AlignCenter,
  AlignHorizontalSpaceAround,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic,
  Link,
  LucideProps,
  Quote,
  Strikethrough,
  Text,
  UnderlineIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Editor } from "@tiptap/react";
import MenuButton from "./MenuButton";
import {
  ForwardRefExoticComponent,
  RefAttributes,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { PopoverClose } from "@radix-ui/react-popover";
export type Level = 1 | 2 | 3 | 4 | 5 | 6;
type TypeHeadingButtons = {
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  level: Level;
}[];
const HeadingButtons: TypeHeadingButtons = [
  {
    Icon: Heading1,
    level: 1,
  },
  {
    Icon: Heading2,
    level: 2,
  },
  {
    Icon: Heading3,
    level: 3,
  },
  {
    Icon: Heading4,
    level: 4,
  },
  {
    Icon: Heading5,
    level: 5,
  },
  {
    Icon: Heading6,
    level: 6,
  },
];
const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const [linkBox, setLinkBox] = useState("");
  useEffect(() => {
    if (!editor) return () => {};
    setLinkBox(editor.getAttributes("link").href);
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return null;
    // const previousUrl = editor.getAttributes("link").href;
    console.log(linkBox);
    if (!linkBox) return;
    console.log(linkBox);

    if (!linkBox)
      return editor.chain().focus().extendMarkRange("link").unsetLink().run();

    try {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkBox })
        .run();
    } catch (e) {
      console.log(e);
      //   alert(e.message);
    }
  }, [editor, linkBox]);
  if (!editor) return null;
  const handleSubmit = () => {
    if (!editor) return;
    const images = editor.$nodes("image");
    console.log(images);
    // editor
    //   .chain()
    //   .focus()
    //   .updateAttributes("image", {
    //     src: "https://new-url.com/image.jpg",
    //   })
    //   .run();
    console.log(editor.getHTML());
  };
  return (
    <div className="flex  sticky z-10 bg-background py-4  top-0 justify-between ">
      <div className=" flex-wrap gap-1 flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <Heading />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="  flex">
            {HeadingButtons.map((btn) => {
              return (
                <DropdownMenuItem className="p-0.5" key={btn.level}>
                  <MenuButton
                    Icon={<btn.Icon />}
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .toggleHeading({ level: btn.level })
                        .run()
                    }
                    className={
                      editor.isActive("heading", { level: btn.level })
                        ? "active"
                        : ""
                    }
                  />
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <MenuButton
          Icon={<Code2 />}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "active" : ""}
        />
        <MenuButton
          Icon={<Text />}
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "active" : ""}
        />

        <MenuButton
          Icon={<Bold />}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "active" : ""}
        />
        <MenuButton
          Icon={<UnderlineIcon />}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? " active" : ""}
        />

        <MenuButton
          Icon={<Italic />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "active" : ""}
        />
        <MenuButton
          Icon={<Strikethrough />}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "active" : ""}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MenuButton Icon={<AlignHorizontalSpaceAround />} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex gap-0.5">
            <DropdownMenuItem asChild>
              <MenuButton
                Icon={<AlignLeft />}
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                className={
                  editor.isActive({ textAlign: "left" }) ? "active" : ""
                }
              />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <MenuButton
                Icon={<AlignCenter />}
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                className={
                  editor.isActive({ textAlign: "center" }) ? "active" : ""
                }
              />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <MenuButton
                Icon={<AlignRight />}
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                className={
                  editor.isActive({ textAlign: "right" }) ? "active" : ""
                }
              />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <MenuButton
                Icon={<AlignJustify />}
                onClick={() =>
                  editor.chain().focus().setTextAlign("justify").run()
                }
                className={
                  editor.isActive({ textAlign: "justify" }) ? "active" : ""
                }
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Popover>
          <PopoverTrigger asChild>
            <MenuButton
              Icon={<Link />}
              className={editor.isActive("link") ? "active" : ""}
            />
          </PopoverTrigger>
          <PopoverContent className="gap-2 flex-col flex">
            <Input
              onChange={(e) => setLinkBox(e.target.value)}
              value={linkBox}
              placeholder="Paste link"
            />

            <div className="flex  gap-2">
              <Button onClick={setLink} variant={"outline"} className="w-fit">
                Done
              </Button>
              <PopoverClose asChild>
                <Button variant={"ghost"} className="w-fit">
                  x
                </Button>
              </PopoverClose>
            </div>
          </PopoverContent>
        </Popover>

        <MenuButton
          Icon={<Quote />}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
        />
      </div>
      <Button onClick={handleSubmit}>Publish</Button>
    </div>
  );
};
export default MenuBar;
