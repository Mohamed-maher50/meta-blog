import SkeletonCard from "../SkeletonCard";

export const GridBlogSkeletons = () => {
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
};
