import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Badge } from "../ui/badge";
import { formatCompactNumber } from "@/lib/utils";
import { Users } from "lucide-react";
import SectionLabel from "../miscellaneous/SectionLabel";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
interface TopicCardProps {
  numberOfFollowers: number;
  label: string;
  id: string;
}
const TopicCard = ({ topic }: { topic: TopicCardProps }) => {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <Button
          variant={"secondary"}
          asChild
          className="shrink-0    transition-all duration-200 focus:outline-none"
          aria-label={`${topic.label} topic with ${formatCompactNumber(
            topic.numberOfFollowers
          )} followers`}
        >
          <Badge
            className={`
                              cursor-pointer transition-all duration-200 
                              hover:scale-105 active:scale-95 
                              focus:ring-2 focus:ring-ring focus:ring-offset-2
                              px-3 py-2 sm:px-3.5 sm:py-2 text-xs sm:text-sm 
                              whitespace-nowrap font-medium shadow-sm hover:shadow-md
                              bg-secondary/70 text-secondary-foreground hover:bg-primary/85 hover:text-primary-foreground focus:ring-offset-background
                              
                                dark:bg-secondary/60 dark:text-secondary-foreground dark:hover:bg-primary/90 dark:hover:text-primary-foreground dark:focus:ring-offset-background
                                
                            `}
          >
            <span className="text-pretty">{topic.label}</span>
          </Badge>
        </Button>
      </TooltipTrigger>
      <TooltipContent
        className={` flex items-center gap-2 dark:bg-secondary/90 dark:text-foreground py-2 px-3  bg-card/95 text-foreground border border-border/50`}
      >
        <Users className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="font-medium">
          {formatCompactNumber(topic.numberOfFollowers)} followers
        </span>
      </TooltipContent>
    </Tooltip>
  );
};
export function TopicsCarousel() {
  return (
    <div className="relative w-full ">
      <SectionLabel className="max-sm:flex max-sm:flex-col max-sm:items-center max-sm:mx-auto max-sm:justify-center ">
        Topics to Follow
      </SectionLabel>
      <Label className="text-muted-foreground">
        Discover and follow topics that interest you
      </Label>
      <Carousel
        opts={{
          align: "center",
        }}
        className="my-5 isolate px-14! group relative"
      >
        <CarouselContent>
          {Array.from({ length: 15 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="basis-1/3  sm:basis-1/7 md:basis-1/5 lg:basis-1/9"
            >
              <TopicCard
                topic={{
                  id: index.toString(),
                  label: "programiog",
                  numberOfFollowers: 20000,
                }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute bottom-full left-0 " />
        <CarouselNext className="absolute right-0 " />
      </Carousel>
    </div>
  );
}
