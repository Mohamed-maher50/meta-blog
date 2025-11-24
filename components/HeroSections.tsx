import React from "react";
import { Button } from "./ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { BLOGS_SECTIONS } from "@/app/page";
import { auth } from "@/auth";
export const HeroSectionSkeleton = () => {
  return (
    <section className="bg-gradient-to-br py-4 from-primary/5 to-primary/10 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-2xl space-y-6">
          {/* Heading skeleton */}
          <Skeleton className="h-10 w-3/4 md:w-2/3 rounded-md" />
          <Skeleton className="h-10 w-1/2 md:w-1/3 rounded-md" />

          {/* Paragraph skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full md:w-5/6 rounded-md" />
            <Skeleton className="h-4 w-4/5 md:w-3/5 rounded-md" />
          </div>

          {/* Buttons skeleton */}
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-10 w-32 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>
      </div>
    </section>
  );
};

const HeroSection = async () => {
  const session = await auth();
  const writeNewStoryLink = session?.user ? "/blogs/new" : "/auth/signin";
  return (
    <section className="bg-gradient-to-br py-4 from-primary/5 to-primary/10 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Discover Stories, Ideas & Insights
          </h2>
          <p className="text-lg text-secondary-foreground mb-8">
            Explore a community of writers sharing knowledge about web
            development, design, and technology.
          </p>
          <div className="flex gap-4">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link scroll={true} href={`#${BLOGS_SECTIONS[0].label}`}>
                Start Reading
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/5 bg-transparent"
              asChild
            >
              <Link href={writeNewStoryLink}>Write a Story</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
