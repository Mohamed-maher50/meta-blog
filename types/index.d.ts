import { Blog, Format, User } from "@prisma/client";

export type TArticle = {
  cover: {
    public_id: string;
    width: number;
    format: Format;
    height: number;
    created_at: string;
  };
  title: string;
  content: JSONContent;

  category: Category;
  author?: User;
};
export interface AuthorBlog extends Blog {
  author: User;
  category: Category;
}
export interface IUserWithImage extends User {
  image: {
    url: string;
    width: number;
    height: number;
  };
}
