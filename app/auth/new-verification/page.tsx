"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { verifyToken } from "@/actions/verifyToken";
import Link from "next/link";

type VerificationState = "loading" | "success" | "error";

export default function Component() {
  const [state, setState] = useState<VerificationState>("loading");
  const params = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("");
  const token = params.get("token");

  useEffect(() => {
    if (!token) {
      setErrorMessage(
        "Verification token missing. Please use the link sent to your email to verify your account."
      );
      setState("error");
      return;
    }

    (async () => {
      const res = await verifyToken(token);
      if (res.status > 299) {
        setState("error");
        setErrorMessage(res.message);
      } else if (res.status == 200) {
        setState("success");
      }
    })();
    setState("success");
  }, [token]);
  return (
    <div className="flex items-center justify-center ">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Verify Your Account</CardTitle>
          <CardDescription>
            Verifying your account helps us keep your information secure and
            ensures only you have access.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state === "success" ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Verification successful! Your account has been verified.
                </AlertDescription>
              </Alert>
              <Button variant={"ghost"} asChild>
                <Link href={"/auth/signin"} replace>
                  Login Now
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <Alert variant="destructive" hidden={state != "error"}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="w-full"
                hidden={state != "loading"}
                disabled
              >
                {state === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
