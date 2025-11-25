"use client";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Logo from "../miscellaneous/Logo";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signUpSchema, TSignUpSchema } from "@/schema/authSchema";
import ProvidersFooter from "./ProvidersFooter";
import Link from "next/link";
import axiosClient from "@/lib/axios.client";

const SignUpForm = ({ className, ...props }: React.ComponentProps<"form">) => {
  const form = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const router = useRouter();
  const handleSubmit = async (values: TSignUpSchema) => {
    try {
      toast.promise(axiosClient.post("/api/auth/", values), {
        loading: "please wait...",
        success: async ({ status }) => {
          if (status == 201) {
            setTimeout(() => {
              router.push("/auth/signin");
            }, 500);
            return "email created Successfully";
          }
        },
        error: (err: { message: string }) => {
          return err.message || "something wrong!";
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form {...form}>
      <form
        className={cn("flex max-w-3xl mt-2 mx-auto flex-col gap-6", className)}
        {...props}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Logo className="w-fit mx-auto" />
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">SignUp </h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to create your account
          </p>
        </div>
        <div className="grid gap-2">
          <div className="grid gap-3">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>FullName</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ex:mohamed maher"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        placeholder="Enter your password"
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>confirm password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        placeholder="Re-enter your password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          <ProvidersFooter />
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signin" className="underline underline-offset-4">
            SignIn
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
