"use client";

import { AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  title?: string;
  message?: string;
  code?: string | number;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "minimal" | "card" | "hero";
}

export function ErrorView({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  code,
  action,
  variant = "default",
}: ErrorProps) {
  if (variant === "minimal") {
    return (
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <span className="text-sm">{message}</span>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="rounded-lg  capitalize border border-destructive/20 bg-destructive/5 p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
          <div className="flex-1">
            <h3 className="font-semibold capitalize text-destructive">
              {title}
            </h3>
            <p className="mt-1 capitalize text-sm text-secondary-foreground">
              {message}
            </p>
            {action && (
              <Button
                variant="outline"
                size="sm"
                onClick={action.onClick}
                className="mt-3 bg-transparent"
              >
                {action.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-secondary/5 px-4 py-20 dark:from-background dark:via-background dark:to-secondary/10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-2xl">
          {/* Error Icon - Larger and more prominent */}
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-destructive/10 to-destructive/5 backdrop-blur-sm">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>

          {/* Error Code - Subtle accent */}
          {code && (
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/50 px-4 py-2 text-sm font-medium text-secondary-foreground backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-destructive" />
              Error {code}
            </div>
          )}

          {/* Title - Large and bold */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-secondary-foreground leading-relaxed max-w-xl mx-auto">
              {message}
            </p>
          </div>

          {/* Action Button - Premium styling */}
          {action && (
            <Button
              onClick={action.onClick}
              size="lg"
              className="mt-4 gap-2 bg-primary hover:bg-primary/90 text-white rounded-lg px-8 py-6 text-base font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
            >
              {action.label}
              <ArrowRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-2xl bg-gradient-to-br from-secondary/30 to-secondary/10 p-12 dark:from-secondary/20 dark:to-secondary/5 border border-secondary/20">
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-destructive/10">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <div className="text-center space-y-3">
        {code && (
          <p className="text-sm font-medium text-secondary-foreground">
            Error {code}
          </p>
        )}
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        <p className="text-base text-secondary-foreground max-w-md">
          {message}
        </p>
      </div>
      {action && (
        <Button onClick={action.onClick} size="lg" className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  );
}
