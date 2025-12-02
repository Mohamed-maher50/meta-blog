"use client";
import { useState } from "react";
import { Copy, Check, Shield, Lock, Globe } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
interface BaseEmailTemplate {
  senderEmail: string;
  type: "OTP" | "MESSAGE";
  date: string;
  body: string;
}

interface OtpTemplate extends BaseEmailTemplate {
  type: "OTP";
  code: string;
  subject?: string;
}

interface MessageTemplate extends BaseEmailTemplate {
  type: "MESSAGE";
  subject: string;
  code?: string;
}
export type EmailTemplateProps = OtpTemplate | MessageTemplate;
export default function EmailTemplate({
  senderEmail,
  subject,
  type = "MESSAGE",
  date,
  body,
  code,
}: EmailTemplateProps) {
  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-950 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Email Container - Simulating an email client view */}
      <div className="w-full max-w-2xl bg-white dark:bg-black rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Fake Email Client Header */}
        <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 text-xs text-slate-500 dark:text-slate-400 flex flex-col gap-1">
          <div className="flex justify-between">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              From:
            </span>
            <span>Security Team &lt;{senderEmail}&gt;</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Subject:
            </span>
            <span className="text-slate-900 dark:text-slate-100 font-medium">
              {type === "OTP" ? "🔐 Your Verification Code" : subject}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Date:
            </span>
            <span>{date}</span>
          </div>
        </div>

        {/* Email Content Area */}
        <div className="p-0">
          {/* Brand Header */}
          <div className="bg-slate-900 text-white p-8 text-center">
            <div className="mx-auto bg-white/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Acme Inc.</h2>
          </div>

          <div className="p-8 sm:p-12">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Authenticate your account
            </h3>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Hello,
              <br />
              <br />
              {type == "OTP" ? (
                <span>
                  We received a request to sign in to your
                  <strong>Acme Inc.</strong> account from a new device. To
                  complete the sign-in process, please enter the verification
                  code below.
                </span>
              ) : (
                body
              )}
            </p>

            {/* OTP Display Block */}
            {type == "OTP" && <OtpLabel code={code as string} />}

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 text-sm">
              If you didn&apos;t attempt to sign in, you can safely ignore this
              email. Someone may have typed your email address by mistake.
            </p>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-8">
              <p className="text-xs text-slate-500 dark:text-slate-500 text-center">
                <Lock className="h-3 w-3 inline-block mr-1 mb-0.5" />
                Your security is important to us. Never share this code with
                anyone.
              </p>
            </div>
          </div>

          {/* Email Footer */}
          <div className="bg-slate-50 dark:bg-slate-900 p-6 text-center text-xs text-slate-400 dark:text-slate-500 space-y-2">
            <p>© {date} Acme Inc. All rights reserved.</p>
            <p>123 Innovation Drive, Tech Valley, CA 94043</p>
            <div className="flex justify-center gap-4 mt-2">
              <a
                href="#"
                className="hover:text-slate-600 dark:hover:text-slate-300 underline"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-slate-600 dark:hover:text-slate-300 underline"
              >
                Contact Support
              </a>
              <a
                href="#"
                className="hover:text-slate-600 dark:hover:text-slate-300 underline"
              >
                Unsubscribe
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-2 text-slate-400 text-xs">
        <Globe className="h-3 w-3" />
        <span>Preview Mode • 600px Width</span>
      </div>
    </div>
  );
}
interface OtpLabelProps {
  code: string;
}
const OtpLabel = ({ code }: OtpLabelProps) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="my-8">
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg p-8 text-center">
        <span className="block text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">
          Verification Code
        </span>
        <div className="flex items-center justify-center gap-4">
          <span className="font-mono text-4xl sm:text-5xl font-bold tracking-[0.2em] text-slate-900 dark:text-slate-100 pl-[0.2em]">
            {code}
          </span>
        </div>
        <div className="mt-4 text-xs text-slate-400">
          (Valid for 10 minutes)
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className={cn(
            "gap-2 transition-all",
            copied
              ? "text-green-600 hover:text-green-700 hover:bg-green-50"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              Copied to clipboard
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy Code
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
