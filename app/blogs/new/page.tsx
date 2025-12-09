"use client";

import CreateBlogForm from "@/components/NewBlogComponents/CreateBlogForm";
import { DEFAULT_BLOG_EDITOR_CONTENT } from "@/constants/defaultBlogEditorContent";

const NewArticle = () => {
  return (
    <div className=" py-5 ">
      <CreateBlogForm defaultContent={DEFAULT_BLOG_EDITOR_CONTENT} />
    </div>
  );
};

export default NewArticle;
