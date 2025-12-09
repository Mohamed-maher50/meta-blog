"use client";

import { defaultEditorContent } from "@/lib/content";

import CreateBlogForm from "@/components/NewBlogComponents/CreateBlogForm";

const NewArticle = () => {
  return (
    <div className=" py-5 ">
      <CreateBlogForm defaultContent={defaultEditorContent} />
    </div>
  );
};

export default NewArticle;
