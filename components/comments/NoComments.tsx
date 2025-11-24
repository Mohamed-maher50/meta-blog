import { MessageCircle } from "lucide-react";
import React from "react";

const NoComments = ({ active }: { active: boolean }) => {
  return (
    <div
      hidden={!active}
      className="flex flex-col items-center justify-center text-center"
    >
      <MessageCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">
        No comments yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Be the first to share your thoughts about this post. Your feedback helps
        create meaningful discussions.
      </p>
    </div>
  );
};

export default NoComments;
