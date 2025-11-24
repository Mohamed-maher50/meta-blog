import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-2xl mx-auto">
        {/* 404 Number */}
        <div className="space-y-2">
          <div className="text-8xl md:text-9xl font-black tracking-tighter">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              404
            </span>
          </div>
          <div className="h-1 w-24 bg-primary/20 mx-auto rounded-full"></div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Page Not Found
          </h1>
          <p className="text-lg text-secondary-foreground-500 max-w-md mx-auto leading-relaxed">
            The page you&apos;re looking for seems to have wandered off into the
            digital void. Let&apos;s get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-secondary-foreground-300 text-foreground hover:bg-secondary-50 dark:hover:bg-secondary-800 bg-transparent"
          >
            <Link href="/" className="flex items-center gap-2">
              Go Back
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="pt-8 space-y-2 text-xs text-secondary-foreground-400">
          <p>Error Code: 404</p>
          <p className="font-mono">Resource not found in the system</p>
        </div>
      </div>
    </div>
  );
}
