"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import {
  newSubscriptionSchema,
  subscriptionValues,
} from "@/schema/SubscriptionSchema";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";
import axiosClient from "@/lib/axios.client";
function SubscriptionForm() {
  const form = useForm<subscriptionValues>({
    resolver: zodResolver(newSubscriptionSchema),
    defaultValues: { email: "" },
  });
  const onSubmit = async (values: subscriptionValues) => {
    try {
      // Simulate backend call
      await axiosClient.post("/api/subscriptions", values);

      toast.success("Subscription Successful 🎉", {
        description: "You have subscribed to our newsletter.",
      });

      form.reset();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      let message = "Something went wrong";
      if (axios.isAxiosError(error))
        message = error?.response?.data?.message || message;
      toast.error(message, {
        description: "Please try again later.",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full grid gap-2"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="relative">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Your Email"
                    className="w-full bg-white placeholder:text-secondary-foreground-400 dark:bg-secondary-800 p-3.5 min-h-12"
                  />
                </FormControl>

                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-foreground-500 pointer-events-none" />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          size="lg"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
    </Form>
  );
}

export default SubscriptionForm;
