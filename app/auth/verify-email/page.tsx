"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { resendOtpAction } from "@/actions/generateOtpAction";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verificationOtpAction } from "@/actions/VerficationOtpAction";
const OTP_TIME_EXPIRATION = 2; //minutes
export default function VerifyEmailPage() {
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(OTP_TIME_EXPIRATION * 60);
  const router = useRouter();
  const search = useSearchParams();
  useEffect(() => {
    const email = search.get("email");
    if (!email) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length !== 6) return;
    setIsLoading(true);
    const email = search.get("email");
    if (!email) return;
    const result = await verificationOtpAction({ email, code: code });
    if (result.status) {
      toast.success("email is verified");
      router.replace("/auth/signin");
    } else toast.error(result.error);
    setIsLoading(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  const handleResend = async () => {
    const email = search.get("email");
    if (!email) return;
    setCode("");
    const status = await resendOtpAction(email);
    if (!status.ok) return toast.error("error during resend otp");
    setTimeLeft(OTP_TIME_EXPIRATION * 60);
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/auth/signin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mx-auto mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl text-center">
              Verify your email
            </CardTitle>
            <CardDescription className="text-center pt-2">
              We&apos;ve sent a 6-digit code to your email. Enter it below to
              verify your account.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Verification code</Label>
                <div className="flex gap-2 justify-center">
                  <InputOTP
                    value={code}
                    onChange={setCode}
                    pattern={REGEXP_ONLY_DIGITS}
                    maxLength={6}
                    disabled={isLoading}
                  >
                    <InputOTPGroup>
                      {Array.from({ length: 6 }, (v, k) => k).map(
                        (cellNumber) => (
                          <InputOTPSlot index={cellNumber} key={cellNumber} />
                        )
                      )}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-10 mt-6"
                disabled={isLoading || code.length !== 6 || timeLeft === 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify email"
                )}
              </Button>

              <div className="pt-4 space-y-2">
                <p className="text-xs text-muted-foreground text-center">
                  Code expires in:{" "}
                  <span className="font-semibold text-foreground">
                    {formatTime(timeLeft)}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  Didn&apos;t receive the code?{" "}
                  <Button
                    onClick={handleResend}
                    disabled={timeLeft !== 0}
                    variant={"secondary"}
                    size={"sm"}
                  >
                    Resend
                  </Button>
                </p>
              </div>
            </form>
          </CardContent>

          {/* <CardContent className="pt-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-500/10 mx-auto">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Email verified!</h3>
                  <p className="text-sm text-muted-foreground">
                    Your email has been verified successfully. You can now
                    access your account.
                  </p>
                </div>

                <Button className="w-full mt-6">Continue to dashboard</Button>

                <p className="text-xs text-muted-foreground pt-2">
                  Or go back to{" "}
                  <Link
                    href="/"
                    className="text-primary hover:underline font-medium"
                  >
                    home
                  </Link>
                </p>
              </div>
            </CardContent> */}
        </Card>
      </div>
    </main>
  );
}
