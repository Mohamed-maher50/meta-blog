import {
  Blog,
  Comment,
  Favorites,
  Notification,
  Topics,
  User,
  UserTopic,
} from "@prisma/client";
import { JSONContent } from "novel";

interface populatedBlogTopics {
  id: string;
  topic: Topics;
}
export interface BlogCardProps extends Omit<Blog, "content" | "authorId"> {
  author: UserInfo;
  BlogTopics: populatedBlogTopics[];
  isSaved: boolean;
  _count: {
    BlogLike: number;
    Comment: number;
  };
  Editable?: boolean;
  Deletable?: boolean;
  BlogLike: { userId: string }[];
  favorites: { userId: string }[];
}
// will deprecate
export interface AuthorBlog extends Blog {
  author: User;
  BlogTopics: populatedBlogTopics[];
  isFavorite: boolean;
}

export interface IUserWithImage extends User {
  image: string;
}

export interface BlogWithRelations extends Blog {
  author: UserInfo;
  BlogTopics: {
    id: string;
    topic: Topics;
  }[];
}
type WithRelation<T extends string> = Notification & {
  [G in T]: {
    id: string;
    name: string;
    image: string;
    email: string;
  };
};

// export type NotificationWithUser = WithRelation<"user">;

export type NotificationWithActor = WithRelation<"actor">;

// export type NotificationWithPersons = WithRelation<"user" | "actor">;
// utils types
export type Join<A, B, Alias extends string> = A & {
  [K in Alias]: B;
};
export type _Count<T, K extends string> = T & {
  _count: {
    [k in K]: number;
  };
};
export type UserInfo = Pick<
  User,
  | "bio"
  | "email"
  | "Social"
  | "image"
  | "jobTitle"
  | "name"
  | "id"
  | "createdAt"
  | "updatedAt"
>;
export type CommentWithAuthor = Join<Comment, UserInfo, "author">;
export type ResponseComment = Join<
  CommentWithAuthor,
  { userId: string }[],
  "CommentLike"
>;
export interface IPagination {
  totalItems: number;
  page: number;
  totalPages: number;
  hasNextPage: number | null;
  hasPrevPage: number | null;
}
export interface ResponseSuccess<T> {
  data: T;
  success: true;
  pagination: IPagination;
  timestamp: string;
}
export interface IFavorites extends Favorites {
  user: UserInfo;
  blog: Blog;
}
export interface SearchResults {
  topics: Topic[];
  authors: Author[];
  blogs: Blog[];
}

export interface FilterTabsProps {
  topics?: Topic[];
  authors?: Author[];
  searchResults?: SearchResults;
  value?: Filters;
  onChange?: (filters: Filters) => void;
  className?: string;
}

export interface Filters {
  topics: string[];
  authors: string[];
  q?: string;
  dateFrom?: string;
  dateTo?: string;
  minPopularity?: number;
  maxPopularity?: number;
}
export interface ExpendedUserTopic extends UserTopic {
  topic: Topics;
  user: UserInfo;
}
export interface ExpendedUserTopic extends Omit<Favorites, "userId", "blogId"> {
  blog: BlogCardProps;
  id: string;
}
export type CompactFavorites = {
  createAt: string;
  id: string;
  blog: BlogCardProps;
};
