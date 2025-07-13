import { Categories } from "@prisma/client";
import { ExtendingError } from "./utils";

export const getCategories = async (): Promise<Categories[]> => {
  const categoriesResponse = await fetch(
    `http://localhost:3000/api/categories`
  );
  if (!categoriesResponse.ok) new ExtendingError(`con't get Categories`, "500");
  return await categoriesResponse.json();
};
