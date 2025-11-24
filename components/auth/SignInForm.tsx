"use client";
import React, { useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Logo from "../miscellaneous/Logo";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, TLoginSchema } from "@/schema/authSchema";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import ProvidersFooter from "./ProvidersFooter";
import { authErrorMessages } from "@/lib/authErrorMessages";
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
const SignInForm = ({ className, ...props }: React.ComponentProps<"form">) => {
  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const handleSubmit = async (values: TLoginSchema) => {
    toast.promise(
      signIn("credentials", {
        ...values,
        redirect: false,
      }),
      {
        loading: "please wait...",
        success: (res) => {
          if (res.error == "verificationError") {
            // toast.warning(
            //   <div>
            //     Verification required.{" "}
            //     <Button
            //       variant="link"
            //       className="p-0 h-auto text-primary  align-baseline"
            //       onClick={async () => {
            //         toast.promise(resend.emails.send({
            //           from:"maher",
            //           to:values.email,
            //           subject:"verification link",
            //           html:`<a href="${}"></a>`
            //         }), {
            //           loading: "verification message creating...",
            //           success: "sended successful",
            //           error: "something wrong",
            //         });
            //       }}
            //     >
            //       Send Verification link
            //     </Button>
            //   </div>
            // );
            return null;
          }
          if (res.error) throw new Error(res.error);
          return "Successfully submitted";
        },
        error: (result) => {
          const message = authErrorMessages(result.message);
          return message;
        },
      }
    );
  };
  const params = useSearchParams();
  const error = params.get("error");
  useEffect(() => {
    if (error) {
      switch (error) {
        case "OAuthAccountNotLinked":
          toast.warning("you already logged in with this email before");
      }
    }
  }, [error]);
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
          <Button type="submit" className="w-full">
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
