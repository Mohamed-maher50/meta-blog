"use client";

import InfiniteScroll, {
  InfiniteScrollProps,
} from "@/components/ui/InfiniteScroll";
import UserCard from "@/components/users/UserCard";
import { UserInfo } from "@/types";
import { Loader2 } from "lucide-react";
import { FC, memo } from "react";
interface InfinityUsersSectionProps extends InfiniteScrollProps {
  data: (UserInfo & { isFollowing: boolean })[];
}
const InfinityUsersSection: FC<InfinityUsersSectionProps> = ({
  data,
  ...otherProps
}) => {
  return (
    <>
      {data?.map((user) => {
        return <UserCard user={user} key={user.id} />;
      })}
      <InfiniteScroll {...otherProps} threshold={1}>
        {otherProps.hasMore && (
          <Loader2 className="my-4 text-muted-foreground mx-auto h-8 w-8 animate-spin" />
        )}
      </InfiniteScroll>
    </>
  );
};
export default memo(InfinityUsersSection);
