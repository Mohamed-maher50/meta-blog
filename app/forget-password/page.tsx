"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
          {!isSubmitted ? (
            <>
              <CardHeader className="space-y-2 pb-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl text-center">
                  Forgot password?
                </CardTitle>
                <CardDescription className="text-center pt-2">
                  Enter your email address and we&apos;ll send you a link to
                  reset your password.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-10 px-4 py-2"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 mt-6"
                    disabled={isLoading || !email}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center pt-2">
                    Remember your password?{" "}
                    <Link
                      href="/login"
                      className="text-primary hover:underline font-medium"
                    >
                      Sign in
                    </Link>
                  </p>
                </form>
              </CardContent>
            </>
          ) : (
            <CardContent className="pt-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-500/10 mx-auto">
                  <Mail className="h-6 w-6 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Check your email</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent a password reset link to{" "}
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>
                <p className="text-xs text-muted-foreground pt-2">
                  Didn't receive the email? Check your spam folder or try
                  another email.
                </p>

                <Button
                  onClick={() => {
                    setEmail("");
                    setIsSubmitted(false);
                  }}
                  variant="outline"
                  className="w-full mt-4"
                >
                  Try another email
                </Button>

                <p className="text-xs text-muted-foreground pt-2">
                  Back to{" "}
                  <Link
                    href="/login"
                    className="text-primary hover:underline font-medium"
                  >
                    sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </main>
  );
}
