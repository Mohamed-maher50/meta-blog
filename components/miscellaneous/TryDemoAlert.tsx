"use client";
import { Alert, AlertDescription } from "../ui/alert";
import { Check, Copy, Info } from "lucide-react";
import { Button } from "../ui/button";
import useClipboard from "@/hooks/useClipboard";
export const DemoEmail = () => {
  const { copier, copiedField } = useClipboard();
  return (
    <Alert className="border-blue-200 py-0! flex items-center  bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30">
      <Info className="size-4 text-blue-600 dark:text-blue-400" />
      <AlertDescription className="text-blue-800 dark:text-blue-300">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="font-medium">Email: </span>
            {process.env.NEXT_PUBLIC_DEMO_EMAIL}
          </div>
          <Button
            size="sm"
            variant="ghost"
            type="button"
            className="size-8 p-0 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900 dark:hover:text-blue-300"
            onClick={() => copier(process.env.NEXT_PUBLIC_DEMO_EMAIL!)}
          >
            {copiedField ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
            <span className="sr-only">copy email</span>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
export const DemoPassword = () => {
  const { copier, copiedField } = useClipboard();
  return (
    <Alert className="border-blue-200 py-0! flex items-center justify-start bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30">
      <Info className="size-4 text-blue-600 dark:text-blue-400" />
      <AlertDescription className="text-blue-800 dark:text-blue-300">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="font-medium">Password: </span>
            {process.env.NEXT_PUBLIC_DEMO_PASSWORD}
          </div>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="size-8 p-0 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900 dark:hover:text-blue-300"
            onClick={() => copier(process.env.NEXT_PUBLIC_DEMO_PASSWORD!)}
          >
            {copiedField ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
            <span className="sr-only">نسخ كلمة المرور</span>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
const TryDemoAlert = () => {
  return (
    <>
      <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30">
        <Info className="size-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-800 dark:text-blue-300">
          <span className="font-semibold">Try the website now!</span>
        </AlertDescription>
      </Alert>
    </>
  );
};

export default TryDemoAlert;
