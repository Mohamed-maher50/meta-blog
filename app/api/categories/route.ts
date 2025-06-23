import { extractFields } from "@/lib/api/extractFields";
import pagination from "@/lib/api/pagination";
import ExtractQuery from "@/lib/api/SearchFields";
import { prisma } from "@/prisma";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const extractedFields = extractFields(searchParams);
  const paginationResult = pagination(searchParams);
  const SearchFields = ExtractQuery(searchParams);
  const searchQuery = SearchFields("name");
  try {
    const blogs = await prisma.categories.findMany({
      where: searchQuery,
      omit: extractedFields,
      ...paginationResult,
    });
    return Response.json(blogs);
  } catch (error) {
    return Response.json(error);
  }
};
