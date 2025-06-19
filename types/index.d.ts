import { User } from "@prisma/client";

export type TArticle = {
  thumbnail: string;
  title: string;
  author: {
    picture: string;
    name: string;
  };
  publishedAt: string;
  category: string;
};

export interface IUserWithImage extends User {
  image: {
    url: string;
    width: number;
    height: number;
  };
}
