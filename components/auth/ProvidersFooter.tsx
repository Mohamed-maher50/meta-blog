import React from "react";
import { GitHubIcon, GoogleIcon } from "../miscellaneous/SocialIcons";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

const ProvidersFooter = () => {
  return (
    <>
      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-background text-muted-foreground relative z-10 px-2">
          Or continue with
        </span>
      </div>
      <Button
        type="button"
        onClick={async () => {
          toast.promise(signIn("github", { redirectTo: "/" }), {
            loading: "please wait",
          });
        }}
        variant="outline"
        className="w-full"
      >
        <GitHubIcon />
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
        <GoogleIcon />
        Login with Google
      </Button>
    </>
  );
};

export default ProvidersFooter;
