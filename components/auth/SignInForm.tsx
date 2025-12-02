"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Logo from "../miscellaneous/Logo";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, TLoginSchema } from "@/schema/authSchema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ProvidersFooter from "./ProvidersFooter";
import { LoginAction } from "@/actions/LoginAction";
import { useSession } from "next-auth/react";

const FormHeader = () => {
  return (
    <>
      <Logo className="w-fit mx-auto" />
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
    </>
  );
};
const defaultValues = {
  email: "",
  password: "",
};

const SignInForm = ({ className, ...props }: React.ComponentProps<"form">) => {
  const { update } = useSession();
  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = async (values: TLoginSchema) => {
    const result = await LoginAction(values);
    if (result.status == 302)
      return router.replace(`/auth/verify-email?email=${values.email}`);
    if (!result.success) {
      return toast.error(result.message, {
        position: "top-center",
      });
    }
    toast.success("successfully login");
    await update();
    if (result.status == 200) router.replace("/");
  };

  return (
    <Form {...form}>
      <form
        className={cn("flex max-w-3xl mt-10 mx-auto flex-col gap-6", className)}
        {...props}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormHeader />
        <div className="grid gap-2">
          <div className="grid gap-3">
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
                        placeholder="**************"
                        {...field}
                      />
                    </FormControl>
                    <Link
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </FormItem>
                );
              }}
            />
          </div>
          <Button
            disabled={form.formState.isSubmitting || submitted}
            type="submit"
            className="w-full"
          >
            Login
          </Button>
          <ProvidersFooter />
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signUp" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default SignInForm;
