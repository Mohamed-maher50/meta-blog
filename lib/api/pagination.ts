const pagination = (searchParams: URLSearchParams) => {
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const skip = (parseInt(page) - 1) * +limit;
  return {
    skip,
    take: parseInt(limit),
  };
};

export default pagination;
