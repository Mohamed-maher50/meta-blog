"use client";
import { useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useSession } from "next-auth/react";
import { baseUrl } from "@/lib/baseUrl";
const UpdateBlogView = ({ blogId }: { blogId: string }) => {
  const { data } = useSession();
  useEffect(() => {
    (async () => {
      try {
        const fp = await FingerprintJS.load();
        const { visitorId } = await fp.get();
        const storageVisitorIds = localStorage.getItem("visitor_ids");
        if (!storageVisitorIds)
          return localStorage.setItem(
            "visitor_ids",
            JSON.stringify([visitorId])
          );
        const arrayOfLocalStorageIds = JSON.parse(
          storageVisitorIds
        ) as string[];
        if (
          arrayOfLocalStorageIds &&
          !arrayOfLocalStorageIds.includes(visitorId)
        )
          arrayOfLocalStorageIds.push(visitorId);
        localStorage.setItem(
          "visitor_ids",
          JSON.stringify(arrayOfLocalStorageIds)
        );
        await fetch(`${baseUrl}/api/blogs/${blogId}/views`, {
          method: "PATCH",
          body: JSON.stringify({
            blogId,
            visitor_ids: arrayOfLocalStorageIds,
            userId: data?.user.userId,
          }),
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {}
    })();
  }, [blogId, data]);
  return null;
};

export default UpdateBlogView;
