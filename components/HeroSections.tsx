import { Button } from "./ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { auth } from "@/auth";
import Image from "next/image";
export const HeroSectionSkeleton = () => {
  return (
    <section className="bg-linear-to-br py-4 from-primary/5 to-primary/10 border-b border-border">
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
    <section className="relative overflow-hidden bg-background py-20 sm:py-32 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left column - Text content */}
          <div>
            {/* Featured tag */}
            <div className="mb-8 inline-block rounded-full border border-border bg-card px-4 py-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                ✨ Featured this week
              </span>
            </div>

            {/* Main headline */}
            <h1 className="mb-6 text-balance text-5xl font-work-sans font-bold leading-tight text-foreground sm:text-6xl lg:text-5xl">
              Dive into <span className="italic">great ideas</span> and
              meaningful stories
            </h1>

            {/* Subheading */}
            <p className="mb-8 max-w-2xl text-balance text-xl leading-relaxed text-muted-foreground">
              Explore deep-dive essays, thoughtful reflections, and compelling
              narratives from writers and thinkers around the world.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <Button
                size={"lg"}
                className="bg-primary rounded-full hover:bg-primary/90 text-primary-foreground"
              >
                <Link scroll={true} href={`#blog_categories`}>
                  Start Reading
                </Link>
              </Button>
              <Button
                variant="outline"
                size={"lg"}
                className="border-primary rounded-full text-primary hover:bg-primary/5 bg-transparent"
                asChild
              >
                <Link href={writeNewStoryLink}>Write a Story</Link>
              </Button>
            </div>
          </div>

          <div className="relative hidden h-96 overflow-hidden rounded-2xl lg:block">
            <Image
              src={"https://picsum.photos/800/600"}
              alt="Blog writing and creative workspace"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Background accent */}
      <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl" />
    </section>
  );
};

export default HeroSection;
