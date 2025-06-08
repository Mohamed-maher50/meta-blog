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
