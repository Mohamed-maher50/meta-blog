"use client";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { signIn } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const signUpSchema = z
  .object({
    name: z.string().min(2, { message: "name is too short" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .max(100, { message: "Password too long" }),
    confirmPassword: z.string(),
  })
  .refine((fields) => fields.password === fields.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
const SignUpForm = ({ className, ...props }: React.ComponentProps<"form">) => {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });

  const router = useRouter();
  const handleSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      const { status } = await axios.post("/api/auth/", values);
      if (status == 201) router.push("/auth/signin");
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
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>
          <Button
            type="button"
            onClick={async () => {
              await signIn("github", { redirectTo: "/" });
            }}
            variant="outline"
            className="w-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Login with GitHub
          </Button>
          <Button
            type="button"
            onClick={async () => {
              await signIn("google", { redirectTo: "/" });
            }}
            variant="outline"
            className="w-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="100"
              viewBox="0 0 50 50"
              className="bg-white p-0.5 rounded-full"
            >
              <path
                className=""
                d="M 25.996094 48 C 13.3125 48 2.992188 37.683594 2.992188 25 C 2.992188 12.316406 13.3125 2 25.996094 2 C 31.742188 2 37.242188 4.128906 41.488281 7.996094 L 42.261719 8.703125 L 34.675781 16.289063 L 33.972656 15.6875 C 31.746094 13.78125 28.914063 12.730469 25.996094 12.730469 C 19.230469 12.730469 13.722656 18.234375 13.722656 25 C 13.722656 31.765625 19.230469 37.269531 25.996094 37.269531 C 30.875 37.269531 34.730469 34.777344 36.546875 30.53125 L 24.996094 30.53125 L 24.996094 20.175781 L 47.546875 20.207031 L 47.714844 21 C 48.890625 26.582031 47.949219 34.792969 43.183594 40.667969 C 39.238281 45.53125 33.457031 48 25.996094 48 Z"
              ></path>
            </svg>
            Login with Google
          </Button>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <a href="#" className="underline underline-offset-4">
            Sign up
          </a>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
