"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios, { AxiosResponse } from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Send } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  createCommentSchema,
  createCommentsSchemaTypes,
} from "@/schema/Comments";
import { CommentWithAuthor } from "@/types";
import { Blog, NotificationType } from "@prisma/client";

interface NewCommentFormProps {
  blogId: string;
  blog: Blog;
}

export default function NewCommentForm({ blogId, blog }: NewCommentFormProps) {
  const form = useForm<createCommentsSchemaTypes>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: "",
    },
  });
  const queryClient = useQueryClient();
  const onSubmit = async (values: createCommentsSchemaTypes) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const { status, data }: AxiosResponse<CommentWithAuthor> =
        await axios.post(`/api/blogs/${blogId}/comments`, {
          ...values,
        });

      if (status !== 201) throw new Error("Failed to post comment");
      if (!data) throw new Error("No comment data returned");
      await axios.post("/api/notifications", {
        type: NotificationType.COMMENT,
        userId: blog.authorId,
        entityId: blogId,
      });
      queryClient.invalidateQueries({
        queryKey: ["blog_comments_query_key"],
      });
      toast.success("Comment posted!");
      form.reset();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err);
      toast.error(err.response?.data?.error || "Failed to post comment");
    }
  };

  return (
    <div className="border-t border-border p-6 bg-card">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add a comment</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share your thoughts..."
                    className="min-h-[80px] resize-none border-border focus:border-primary focus:ring-primary"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={form.formState.isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="h-4 w-4 mr-1" />
              {form.formState.isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
